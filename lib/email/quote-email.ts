import { Resend } from 'resend'
import { getEnv } from '../utils/env'
import { fmtMoney, fmtRange } from '../utils/format'
import { logger } from '../utils/logger'
import type { QuoteAnswers, QuoteResult } from '../../types/quote'

let client: Resend | null = null
function getResend() {
  if (!client) client = new Resend(getEnv('RESEND_API_KEY'))
  return client
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function tempBadge(temp: string): string {
  if (temp === 'hot')  return '🔥 Hot Lead'
  if (temp === 'warm') return '☀️ Warm Lead'
  return '❄️ Cold Lead'
}

// ─── Shared email styles ──────────────────────────────────────────────────────

const shared = {
  body:      'font-family:Arial,sans-serif;color:#111;max-width:620px;margin:0 auto;padding:24px;background:#fff',
  header:    'background:#000;padding:20px 24px;border-radius:8px 8px 0 0',
  logo:      'display:block',
  wrap:      'background:#f9fafb;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:28px 24px',
  label:     'font-size:0.72rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#9ca3af;margin-bottom:6px',
  card:      'background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:18px 20px;margin-bottom:12px',
  divider:   'border:none;border-top:1px solid #e5e7eb;margin:20px 0',
  foot:      'text-align:center;font-size:0.72rem;color:#9ca3af;margin-top:16px',
  pill:      'display:inline-block;background:#f3f4f6;border-radius:100px;padding:4px 12px;font-size:0.78rem;color:#374151;margin:3px',
  primaryBtn:'display:inline-block;background:#000;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:0.9rem;font-weight:600;margin-right:10px;margin-top:8px',
  secondBtn: 'display:inline-block;background:#fff;color:#000;text-decoration:none;padding:11px 24px;border-radius:6px;font-size:0.9rem;font-weight:600;border:1px solid #d1d5db;margin-top:8px',
}

// ─── Client email ─────────────────────────────────────────────────────────────

function buildClientHtml(answers: QuoteAnswers, result: QuoteResult): string {
  const range    = fmtRange(result.rangeMin, result.rangeMax)
  const greeting = answers.contactName ? answers.contactName.split(' ')[0] : 'there'
  const included = result.whatsIncluded.map(i => `<span style="${shared.pill}">${i}</span>`).join('')
  const monthly  = result.monthlyPlanName
    ? `<tr><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#737577;font-size:0.85rem;width:140px;vertical-align:top;font-weight:600">Monthly Support</td><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:0.95rem">${result.monthlyPlanName} — starting at ${fmtMoney(result.monthlyMin)}/mo</td></tr>`
    : ''
  const nextStep = result.leadTemp === 'hot'
    ? `<a href="https://www.moso.marketing/contact" style="${shared.primaryBtn}">Book a Project Fit Call</a><a href="https://www.moso.marketing/contact" style="${shared.secondBtn}">Start With a Strategy Session</a>`
    : `<a href="https://www.moso.marketing/contact" style="${shared.primaryBtn}">Start With a Strategy Session</a>`

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${shared.body}">
  <div style="${shared.header}">
    <img src="https://www.moso.marketing/images/moso-logo-white.svg" alt="MOSO" height="28" style="${shared.logo}">
  </div>
  <div style="${shared.wrap}">
    <p style="font-size:0.85rem;color:#737577;margin:0 0 4px">Your MOSO Project Estimate</p>
    <h1 style="font-size:1.5rem;font-weight:700;color:#000;margin:0 0 6px">${result.packageName}</h1>
    <p style="font-size:0.95rem;color:#374151;line-height:1.6;margin:0 0 24px">${result.packageDesc}</p>

    <div style="${shared.card}">
      <div style="${shared.label}">Estimated Investment</div>
      <div style="font-size:2rem;font-weight:700;color:#000;letter-spacing:-0.02em;line-height:1.1">${range}</div>
    </div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#737577;font-size:0.85rem;width:140px;vertical-align:top;font-weight:600">Recommended Path</td>
        <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:0.95rem">${result.packageName}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#737577;font-size:0.85rem;vertical-align:top;font-weight:600">Estimated Timeline</td>
        <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:0.95rem">${result.timeline}</td>
      </tr>
      ${monthly}
    </table>

    <div style="margin-bottom:24px">
      <div style="${shared.label}">Likely Included</div>
      <div style="margin-top:8px">${included}</div>
    </div>

    <hr style="${shared.divider}">

    <p style="font-size:0.95rem;color:#111;font-weight:600;margin:0 0 4px">Hi ${greeting},</p>
    <p style="font-size:0.92rem;color:#374151;line-height:1.65;margin:0 0 20px">
      This estimate is based on the details you shared in the MOSO quote builder.
      Investment ranges reflect typical project scopes and may shift once we review your full requirements together.
      The best next step is a short conversation — so we can shape the right path before we price the work.
    </p>

    <div>${nextStep}</div>

    <hr style="${shared.divider}">
    <p style="font-size:0.8rem;color:#9ca3af;margin:0;line-height:1.6">
      This estimate was generated by the MOSO project estimator and is not a formal proposal or contract.
      Final scopes and pricing are determined after a discovery conversation.
    </p>
  </div>
  <p style="${shared.foot}">MOSO Agency · <a href="https://www.moso.marketing" style="color:#9ca3af">moso.marketing</a> · Born in Louisiana, building futures worldwide.</p>
</body>
</html>`
}

// ─── Internal MOSO email ──────────────────────────────────────────────────────

function buildInternalHtml(answers: QuoteAnswers, result: QuoteResult): string {
  const range   = fmtRange(result.rangeMin, result.rangeMax)
  const badge   = tempBadge(result.leadTemp)
  const goals   = answers.buildGoals.join(', ') || '—'
  const services= answers.services.join(', ') || '—'
  const monthly = result.monthlyPlanName || 'None selected'
  const review  = answers.wantsMOSOReview ? '✅ Yes' : '❌ No'

  const rows = [
    ['Name',              answers.contactName || '—'],
    ['Email',             `<a href="mailto:${answers.contactEmail}" style="color:#000">${answers.contactEmail}</a>`],
    ['Business',          answers.businessName || '—'],
    ['Website',           answers.websiteUrl ? `<a href="${answers.websiteUrl}" style="color:#000">${answers.websiteUrl}</a>` : '—'],
    ['Phone',             answers.phone || '—'],
    ['Lead Score',        `${result.leadScore}/100 — ${badge}`],
    ['Package',           result.packageName],
    ['Estimated Range',   range],
    ['Timeline Estimate', result.timeline],
    ['Monthly Plan',      monthly],
    ['Budget Selected',   answers.budget],
    ['Timeline Request',  answers.timeline],
    ['Stage',             answers.stage],
    ['Business Type',     answers.businessType],
    ['Outcome',           answers.outcome],
    ['Goals',             goals],
    ['Services',          services],
    ['Wants Review',      review],
    ['Description',       answers.description || '—'],
  ].map(([label, val]) => `
    <tr>
      <td style="padding:9px 0;border-bottom:1px solid #e5e7eb;color:#737577;font-size:0.82rem;width:150px;vertical-align:top;font-weight:600">${label}</td>
      <td style="padding:9px 0;border-bottom:1px solid #e5e7eb;font-size:0.9rem;color:#111">${val}</td>
    </tr>`).join('')

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="${shared.body}">
  <div style="${shared.header}">
    <img src="https://www.moso.marketing/images/moso-logo-white.svg" alt="MOSO" height="28" style="${shared.logo}">
  </div>
  <div style="${shared.wrap}">
    <h2 style="margin:0 0 4px;font-size:1.1rem;color:#000">New Quote Builder Lead</h2>
    <p style="margin:0 0 20px;font-size:0.9rem;color:#737577">${result.packageName} · ${range}</p>
    <table style="width:100%;border-collapse:collapse">${rows}</table>
    <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb">
      <a href="mailto:${answers.contactEmail}" style="${shared.primaryBtn}">Reply to ${answers.contactName || 'Lead'}</a>
    </div>
  </div>
  <p style="${shared.foot}">MOSO Quote Builder — internal notification</p>
</body>
</html>`
}

// ─── Send functions ───────────────────────────────────────────────────────────

export async function sendQuoteClientEmail(
  answers: QuoteAnswers,
  result: QuoteResult
): Promise<{ ok: boolean }> {
  const resend    = getResend()
  const fromEmail = getEnv('AUDIT_FROM_EMAIL')

  try {
    const res = await resend.emails.send({
      from:    fromEmail,
      to:      answers.contactEmail,
      replyTo: process.env.CONTACT_TO_EMAIL ?? 'info@moso.marketing',
      subject: `Your MOSO project estimate — ${result.packageName}`,
      html:    buildClientHtml(answers, result),
      text:    `Hi ${answers.contactName || 'there'},\n\nYour MOSO estimate:\n\nPackage: ${result.packageName}\nRange: ${fmtRange(result.rangeMin, result.rangeMax)}\nTimeline: ${result.timeline}\n\nVisit https://www.moso.marketing/contact to book your next step.\n\nMOSO Agency`,
    })

    if (res.error) {
      logger.error('Quote client email error', res.error)
      return { ok: false }
    }

    logger.info('Quote client email sent', { to: answers.contactEmail, id: res.data?.id })
    return { ok: true }
  } catch (err) {
    logger.error('Quote client email exception', err)
    return { ok: false }
  }
}

export async function sendQuoteInternalEmail(
  answers: QuoteAnswers,
  result: QuoteResult
): Promise<{ ok: boolean }> {
  const resend    = getResend()
  const fromEmail = getEnv('AUDIT_FROM_EMAIL')
  const toEmail   = process.env.CONTACT_TO_EMAIL ?? 'info@moso.marketing'

  try {
    const res = await resend.emails.send({
      from:    fromEmail,
      to:      toEmail,
      replyTo: answers.contactEmail,
      subject: `New quote builder lead: ${result.packageName} — ${answers.contactName || answers.contactEmail}`,
      html:    buildInternalHtml(answers, result),
      text:    `New quote builder submission\n\nName: ${answers.contactName}\nEmail: ${answers.contactEmail}\nBusiness: ${answers.businessName}\nPackage: ${result.packageName}\nRange: ${fmtRange(result.rangeMin, result.rangeMax)}\nLead Score: ${result.leadScore}/100 (${result.leadTemp})\nWants Review: ${answers.wantsMOSOReview ? 'Yes' : 'No'}`,
    })

    if (res.error) {
      logger.error('Quote internal email error', res.error)
      return { ok: false }
    }

    logger.info('Quote internal email sent', { to: toEmail, id: res.data?.id })
    return { ok: true }
  } catch (err) {
    logger.error('Quote internal email exception', err)
    return { ok: false }
  }
}
