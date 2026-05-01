import { NextRequest, NextResponse } from 'next/server'

// Allow up to 60 seconds — audit pipeline runs PageSpeed + signal extraction.
export const maxDuration = 60

import { z } from 'zod'
import { getSupabaseAdmin } from '../../../../lib/db/supabase-admin'
import { getPageSpeed } from '../../../../lib/audit/pagespeed'
import { fetchPage, fetchRobots, detectSitemap } from '../../../../lib/audit/fetch-site'
import { extractSignals } from '../../../../lib/audit/extract-signals'
import { computeScores, buildTeaserResults, computeLeadQuality } from '../../../../lib/audit/scoring'
import { getOrigin } from '../../../../lib/utils/url'
import { logger } from '../../../../lib/utils/logger'
import type { AuditRawResults } from '../../../../types/audit'

const schema = z.object({ leadId: z.string().uuid() })

export async function POST(req: NextRequest) {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  // Fetch lead record
  const { data: lead, error: leadError } = await db
    .from('audit_leads')
    .select('*')
    .eq('id', leadId)
    .single()

  if (leadError || !lead) {
    logger.error('Lead not found for audit', { leadId })
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  }

  await db.from('audit_leads').update({ status: 'running' }).eq('id', leadId)

  try {
    const url    = lead.website_url as string
    const origin = getOrigin(url)

    logger.info('Starting audit', { leadId, url })

    const [mobile, desktop, homepageResult, robots] = await Promise.all([
      getPageSpeed(url, 'mobile'),
      getPageSpeed(url, 'desktop'),
      fetchPage(url),
      fetchRobots(origin),
    ])

    const sitemap = await detectSitemap(origin, robots.content)

    const signals = extractSignals(homepageResult.body, url)
    signals.robotsStatus  = robots.status
    signals.robotsContent = robots.content
    signals.sitemapFound  = sitemap.found
    signals.sitemapUrl    = sitemap.url

    const { categoryScores, overallScore } = computeScores(signals, mobile, desktop)
    const teaserResults = buildTeaserResults(categoryScores, overallScore, signals)

    const rawResults: AuditRawResults = {
      url,
      mobile,
      desktop,
      signals,
      categoryScores,
      overallScore,
      teaserResults,
      auditedAt: new Date().toISOString(),
    }

    // Compute lead quality
    const { score: leadQualityScore, label: leadQualityLabel } = computeLeadQuality(
      overallScore,
      categoryScores.geo,
      lead.notes as string | null,
      lead.industry as string | null,
      signals.hasStructuredData,
      signals.hasPhoneNumber
    )

    // Save raw results + teaser to site_audits
    await db
      .from('site_audits')
      .insert({
        lead_id:      leadId,
        website_url:  url,
        raw_results:  rawResults as unknown,
        completed_at: new Date().toISOString(),
      })

    // Update lead: teaser ready — no email collected yet
    await db
      .from('audit_leads')
      .update({
        status:               'teaser_ready',
        score:                overallScore,
        seo_score:            categoryScores.seo,
        aeo_score:            categoryScores.aeo,
        geo_score:            categoryScores.geo,
        ux_score:             categoryScores.ux,
        teaser_results_json:  teaserResults as unknown,
        lead_quality_score:   leadQualityScore,
        lead_quality_label:   leadQualityLabel,
      })
      .eq('id', leadId)

    logger.info('Audit teaser ready', { leadId, overallScore })

    return NextResponse.json({ ok: true, leadId, overallScore })
  } catch (err) {
    logger.error('Audit run failed', err)
    await db
      .from('audit_leads')
      .update({ status: 'failed' })
      .eq('id', leadId)
    return NextResponse.json({ error: 'Audit failed' }, { status: 500 })
  }
}
