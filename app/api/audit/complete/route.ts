import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

import { z } from 'zod'
import { getSupabaseAdmin } from '../../../../lib/db/supabase-admin'
import { generateAIReport } from '../../../../lib/audit/ai-report'
import { renderHtmlReport } from '../../../../lib/audit/render-report'
import { sendAuditReport } from '../../../../lib/email/resend'
import { upsertAirtableLead } from '../../../../lib/airtable/map-lead'
import { logger } from '../../../../lib/utils/logger'
import type { AuditRawResults } from '../../../../types/audit'

const schema = z.object({
  sessionId: z.string().uuid(),
  firstName: z.string().min(1).max(100),
  email:     z.string().email(),
  phone:     z.string().max(30).optional(),
  consent:   z.boolean().optional().default(false),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const { sessionId, firstName, email, phone, consent } = parsed.data

  const supabase = getSupabaseAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  // Fetch the audit session
  const { data: lead, error: leadError } = await db
    .from('audit_leads')
    .select('*')
    .eq('id', sessionId)
    .single()

  if (leadError || !lead) {
    return NextResponse.json({ error: 'Audit session not found.' }, { status: 404 })
  }

  if (lead.status === 'queued' || lead.status === 'running') {
    return NextResponse.json(
      { error: 'Your audit is still processing. Please wait a moment and try again.' },
      { status: 409 }
    )
  }

  if (lead.status === 'failed') {
    return NextResponse.json(
      { error: 'The audit could not be completed for this site. Please contact us for a manual review.' },
      { status: 422 }
    )
  }

  // Update lead with personal info
  await db
    .from('audit_leads')
    .update({
      first_name: firstName,
      name:       firstName,
      email,
      phone:      phone ?? null,
      consent:    consent ?? false,
    })
    .eq('id', sessionId)

  // Fetch the raw_results from site_audits
  const { data: auditRecord, error: auditError } = await db
    .from('site_audits')
    .select('id, raw_results')
    .eq('lead_id', sessionId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (auditError || !auditRecord) {
    logger.error('site_audits record not found', { sessionId })
    return NextResponse.json(
      { error: 'Audit data not found. Please try again.' },
      { status: 500 }
    )
  }

  const rawResults = auditRecord.raw_results as AuditRawResults

  // Generate full AI report
  const aiReport = await generateAIReport(rawResults, {
    businessName: lead.business_name as string | null,
    industry:     lead.industry as string | null,
    challenge:    lead.notes as string | null,
    firstName,
  })

  // Render HTML email
  const htmlReport = renderHtmlReport(rawResults, aiReport, firstName, lead.business_name as string | null)

  // Update site_audits with the full AI report + HTML
  await db
    .from('site_audits')
    .update({
      ai_report:   aiReport as unknown,
      html_report: htmlReport,
    })
    .eq('id', auditRecord.id)

  // Send email
  const emailResult = await sendAuditReport({
    to:           email,
    name:         firstName,
    businessName: lead.business_name as string | null,
    websiteUrl:   lead.website_url as string,
    htmlReport,
  })

  if (!emailResult.ok) {
    logger.error('Email send failed', { sessionId, email })
    // Don't fail the whole request — return a warning
    return NextResponse.json(
      {
        ok: false,
        warning: 'Your audit was created, but we couldn\'t send the email. Please try again.',
      },
      { status: 207 }
    )
  }

  // Update lead status to email_sent
  await db
    .from('audit_leads')
    .update({
      status:       'email_sent',
      email_sent_at: new Date().toISOString(),
      category:     aiReport.recommendedMosoService,
    })
    .eq('id', sessionId)

  // Push to Airtable — non-fatal
  await upsertAirtableLead(
    {
      ...lead,
      name:       firstName,
      first_name: firstName,
      email,
      phone:      phone ?? null,
      status:     'email_sent',
      score:      rawResults.overallScore,
      geo_score:  rawResults.categoryScores.geo,
      industry:   lead.industry,
    } as Parameters<typeof upsertAirtableLead>[0],
    aiReport
  )

  logger.info('Audit complete — email sent', { sessionId, email })

  return NextResponse.json({ ok: true })
}
