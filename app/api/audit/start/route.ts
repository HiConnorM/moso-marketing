import { NextRequest, NextResponse, after } from 'next/server'
import { z } from 'zod'
import { getSupabaseAdmin } from '../../../../lib/db/supabase-admin'
import { normalizeUrl, isValidUrl } from '../../../../lib/utils/url'
import { logger } from '../../../../lib/utils/logger'

const schema = z.object({
  websiteUrl:    z.string().min(1).max(500),
  businessName:  z.string().max(200).optional(),
  industry:      z.string().max(200).optional(),
  challenge:     z.string().max(1000).optional(),
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

  const { websiteUrl, businessName, industry, challenge } = parsed.data

  // Validate URL is safe (http/https only, no private IPs)
  let normalizedUrl: string
  try {
    normalizedUrl = normalizeUrl(websiteUrl)
  } catch {
    return NextResponse.json(
      { error: 'Please enter a valid website URL (e.g. https://yoursite.com).' },
      { status: 422 }
    )
  }

  if (!isValidUrl(normalizedUrl)) {
    return NextResponse.json(
      { error: 'Please enter a valid website URL starting with https:// or http://.' },
      { status: 422 }
    )
  }

  // Basic SSRF guard — block private/loopback addresses
  try {
    const host = new URL(normalizedUrl).hostname.toLowerCase()
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.startsWith('192.168.') ||
      host.startsWith('10.') ||
      host.startsWith('172.') ||
      host.endsWith('.local') ||
      host === '0.0.0.0'
    ) {
      return NextResponse.json(
        { error: 'Please enter a valid public website URL.' },
        { status: 422 }
      )
    }
  } catch {
    return NextResponse.json({ error: 'Invalid URL.' }, { status: 422 })
  }

  const supabase = getSupabaseAdmin()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: session, error: insertError } = await (supabase as any)
    .from('audit_leads')
    .insert({
      website_url:   normalizedUrl,
      business_name: businessName ?? null,
      industry:      industry ?? null,
      notes:         challenge ?? null,
      source:        'moso_audit_tool_v2',
      status:        'queued',
    })
    .select('id')
    .single()

  if (insertError || !session) {
    logger.error('Failed to create audit session', insertError)
    return NextResponse.json({ error: 'Failed to start audit. Please try again.' }, { status: 500 })
  }

  const sessionId = session.id as string
  logger.info('Audit session created', { sessionId, url: normalizedUrl })

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? `https://${req.headers.get('host')}`

  after(async () => {
    try {
      await fetch(`${baseUrl}/api/audit/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-key': process.env.INTERNAL_JOB_KEY ?? '',
        },
        body: JSON.stringify({ leadId: sessionId }),
      })
    } catch (err) {
      logger.error('Failed to trigger audit runner', err)
    }
  })

  return NextResponse.json({ ok: true, sessionId })
}
