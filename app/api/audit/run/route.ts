import { NextRequest, NextResponse } from 'next/server'

// Allow up to 60 seconds — the audit pipeline runs PageSpeed + AI which can take 45-90s.
// Vercel Pro supports up to 60s. Upgrade to maxDuration = 300 on Enterprise if needed.
export const maxDuration = 60
import { z } from 'zod'
import { getSupabaseAdmin } from '../../../../lib/db/supabase-admin'
import { getPageSpeed } from '../../../../lib/audit/pagespeed'
import { fetchPage, fetchRobots, detectSitemap } from '../../../../lib/audit/fetch-site'
import { extractSignals } from '../../../../lib/audit/extract-signals'
import { computeScores } from '../../../../lib/audit/scoring'
import { generateAIReport } from '../../../../lib/audit/ai-report'
import { renderHtmlReport } from '../../../../lib/audit/render-report'
import { upsertAirtableLead } from '../../../../lib/airtable/map-lead'
import { sendAuditReport } from '../../../../lib/email/resend'
import { getOrigin } from '../../../../lib/utils/url'
import { logger } from '../../../../lib/utils/logger'
import type { AuditRawResults } from '../../../../types/audit'

const schema = z.object({ leadId: z.string().uuid() })

export async function POST(req: NextRequest) {
  // Protect this endpoint from external calls
  const internalKey = req.headers.get('x-internal-key')
  if (internalKey !== process.env.INTERNAL_JOB_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid leadId' }, { status: 422 })
  }

  const { leadId } = parsed.data
  const supabase = getSupabaseAdmin()

  // Fetch lead
  const { data: lead, error: leadError } = await supabase
    .from('audit_leads')
    .select('*')
    .eq('id', leadId)
    .single()

  if (leadError || !lead) {
    logger.error('Lead not found for audit', { leadId })
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  }

  // Mark as running
  await supabase
    .from('audit_leads')
    .update({ status: 'running' })
    .eq('id', leadId)

  try {
    const url = lead.website_url as string
    const origin = getOrigin(url)

    logger.info('Starting audit', { leadId, url })

    // Run PageSpeed and site fetch in parallel
    const [mobile, desktop, homepageResult, robots] = await Promise.all([
      getPageSpeed(url, 'mobile'),
      getPageSpeed(url, 'desktop'),
      fetchPage(url),
      fetchRobots(origin),
    ])

    const sitemap = await detectSitemap(origin, robots.content)

    // Extract signals
    const signals = extractSignals(homepageResult.body, url)
    signals.robotsStatus = robots.status
    signals.robotsContent = robots.content
    signals.sitemapFound = sitemap.found
    signals.sitemapUrl = sitemap.url

    // Compute scores
    const { categoryScores, overallScore } = computeScores(signals, mobile, desktop)

    const rawResults: AuditRawResults = {
      url,
      mobile,
      desktop,
      signals,
      categoryScores,
      overallScore,
      auditedAt: new Date().toISOString(),
    }

    // Generate AI report
    const aiReport = await generateAIReport(rawResults)

    // Render HTML email
    const htmlReport = renderHtmlReport(
      rawResults,
      aiReport,
      lead.name as string | null,
      lead.business_name as string | null
    )

    // Save audit record
    const { data: audit, error: auditError } = await supabase
      .from('site_audits')
      .insert({
        lead_id: leadId,
        website_url: url,
        raw_results: rawResults,
        ai_report: aiReport,
        html_report: htmlReport,
        completed_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (auditError) {
      logger.error('Failed to save audit', auditError)
    }

    // Update lead with score and status
    await supabase
      .from('audit_leads')
      .update({
        status: 'completed',
        score: overallScore,
        category: aiReport.recommendedMosoService,
      })
      .eq('id', leadId)

    // Send email report
    await sendAuditReport({
      to: lead.email as string,
      name: lead.name as string | null,
      businessName: lead.business_name as string | null,
      websiteUrl: url,
      htmlReport,
    })

    // Push to Airtable — creates/updates Contact and creates Signal
    await upsertAirtableLead(
      { ...lead, status: 'completed', score: overallScore } as Parameters<typeof upsertAirtableLead>[0],
      aiReport
    )

    // Mark CRM sync complete
    await supabase
      .from('audit_leads')
      .update({ crm_synced: true })
      .eq('id', leadId)

    logger.info('Audit completed', { leadId, auditId: audit?.id, overallScore })

    return NextResponse.json({ ok: true, leadId, overallScore })
  } catch (err) {
    logger.error('Audit run failed', err)

    await supabase
      .from('audit_leads')
      .update({ status: 'failed' })
      .eq('id', leadId)

    return NextResponse.json({ error: 'Audit failed' }, { status: 500 })
  }
}
