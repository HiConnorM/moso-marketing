import { NextRequest, NextResponse } from 'next/server'
import { sendQuoteClientEmail, sendQuoteInternalEmail } from '../../../lib/email/quote-email'
import { upsertQuoteLead } from '../../../lib/airtable/quote-lead'
import { logger } from '../../../lib/utils/logger'
import type { QuoteAnswers, QuoteResult } from '../../../types/quote'

// ─── Validation ───────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(body: unknown): { answers: QuoteAnswers; result: QuoteResult } | { error: string } {
  if (!body || typeof body !== 'object') return { error: 'Invalid request body.' }

  const b = body as Record<string, unknown>
  const answers = b.answers as QuoteAnswers | undefined
  const result  = b.result  as QuoteResult  | undefined

  if (!answers || !result) return { error: 'Missing answers or result.' }
  if (typeof answers.contactEmail !== 'string' || !EMAIL_RE.test(answers.contactEmail)) {
    return { error: 'A valid email address is required.' }
  }
  if (typeof answers.contactName !== 'string' || !answers.contactName.trim()) {
    return { error: 'Name is required.' }
  }
  if (typeof result.packageName !== 'string' || !result.packageName) {
    return { error: 'Invalid quote result.' }
  }

  return { answers, result }
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 })
  }

  const validated = validate(body)
  if ('error' in validated) {
    return NextResponse.json({ ok: false, error: validated.error }, { status: 400 })
  }

  const { answers, result } = validated

  logger.info('Quote builder submission', {
    email:   answers.contactEmail,
    package: result.packageName,
    score:   result.leadScore,
    temp:    result.leadTemp,
  })

  // Run all side effects in parallel — non-fatal if any fail
  await Promise.allSettled([
    sendQuoteClientEmail(answers, result),
    sendQuoteInternalEmail(answers, result),
    upsertQuoteLead(answers, result),
  ])

  return NextResponse.json({ ok: true })
}
