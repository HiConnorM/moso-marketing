import { NextRequest, NextResponse, after } from 'next/server'
import { z } from 'zod'
import { getSupabaseAdmin } from '../../../../lib/db/supabase-admin'
import { normalizeUrl } from '../../../../lib/utils/url'
import { logger } from '../../../../lib/utils/logger'

const schema = z.object({
  name: z.string().max(100).optional(),
  email: z.string().email(),
  businessName: z.string().max(200).optional(),
  websiteUrl: z.string().url().max(500),
  notes: z.string().max(1000).optional(),
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

  const data = parsed.data
  const websiteUrl = normalizeUrl(data.websiteUrl)

  const supabase = getSupabaseAdmin()

  const { data: lead, error: insertError } = await supabase
    .from('audit_leads')
    .insert({
      name: data.name ?? null,
      email: data.email,
      business_name: data.businessName ?? null,
      website_url: websiteUrl,
      notes: data.notes ?? null,
      source: 'moso_audit_tool',
      status: 'queued',
    })
    .select('id, email, name, business_name, website_url')
    .single()

  if (insertError || !lead) {
    logger.error('Failed to insert audit lead', insertError)
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 })
  }

  logger.info('Audit lead created', { leadId: lead.id, url: websiteUrl })

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? `https://${req.headers.get('host')}`
  const leadId = lead.id

  // after() keeps the Vercel function alive after the response is sent.
  // This is required — a plain fire-and-forget fetch() gets cancelled on Vercel
  // as soon as the response returns.
  after(async () => {
    try {
      await fetch(`${baseUrl}/api/audit/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-key': process.env.INTERNAL_JOB_KEY ?? '',
        },
        body: JSON.stringify({ leadId }),
      })
    } catch (err) {
      logger.error('Failed to trigger audit runner', err)
    }
  })

  return NextResponse.json({ ok: true, leadId })
}
