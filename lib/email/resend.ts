import { Resend } from 'resend'
import { getEnv } from '../utils/env'
import { logger } from '../utils/logger'

let client: Resend | null = null

function getResend() {
  if (!client) {
    client = new Resend(getEnv('RESEND_API_KEY'))
  }
  return client
}

export async function sendContactEmail({
  name,
  email,
  message,
}: {
  name: string
  email: string
  message: string
}): Promise<{ ok: boolean; id?: string }> {
  const resend = getResend()
  const toEmail = process.env.CONTACT_TO_EMAIL ?? 'info@moso.marketing'

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;color:#111;max-width:600px;margin:0 auto;padding:24px">
  <div style="background:#000;padding:20px 24px;border-radius:8px 8px 0 0">
    <img src="https://www.moso.marketing/images/moso-logo-white.svg" alt="MOSO" height="28" style="display:block">
  </div>
  <div style="background:#f9fafb;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:28px 24px">
    <h2 style="margin:0 0 20px;font-size:1.2rem;color:#000">New Contact Form Submission</h2>
    <table style="width:100%;border-collapse:collapse">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#737577;font-size:0.85rem;width:100px;vertical-align:top;font-weight:600">Name</td>
        <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:0.95rem">${name}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#737577;font-size:0.85rem;vertical-align:top;font-weight:600">Email</td>
        <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:0.95rem"><a href="mailto:${email}" style="color:#000">${email}</a></td>
      </tr>
      <tr>
        <td style="padding:10px 0;color:#737577;font-size:0.85rem;vertical-align:top;font-weight:600">Message</td>
        <td style="padding:10px 0;font-size:0.95rem;line-height:1.6;white-space:pre-wrap">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
      </tr>
    </table>
    <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb">
      <a href="mailto:${email}" style="display:inline-block;background:#000;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:0.9rem;font-weight:600">Reply to ${name}</a>
    </div>
  </div>
  <p style="text-align:center;font-size:0.75rem;color:#9ca3af;margin-top:16px">MOSO Agency — moso.marketing</p>
</body>
</html>`

  try {
    const result = await resend.emails.send({
      from: getEnv('AUDIT_FROM_EMAIL'),
      to: toEmail,
      replyTo: email,
      subject: `New Contact: ${name} — MOSO Website`,
      html,
      text: `New contact form submission\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    })

    if (result.error) {
      logger.error('Resend contact send error', result.error)
      return { ok: false }
    }

    logger.info('Contact email sent', { from: email, id: result.data?.id })
    return { ok: true, id: result.data?.id }
  } catch (err) {
    logger.error('Resend contact exception', err)
    return { ok: false }
  }
}

export async function sendAuditReport({
  to,
  name,
  businessName,
  websiteUrl,
  htmlReport,
}: {
  to: string
  name: string | null
  businessName: string | null
  websiteUrl: string
  htmlReport: string
}): Promise<{ ok: boolean; id?: string }> {
  const resend = getResend()
  const greeting = name ? name : 'there'
  const company = businessName ?? websiteUrl

  try {
    const result = await resend.emails.send({
      from: getEnv('AUDIT_FROM_EMAIL'),
      to,
      subject: `Your SEO + AEO + GEO Audit — ${company}`,
      html: htmlReport,
      text: `Hi ${greeting}, your MOSO AEO/SEO audit for ${company} is ready. Please view this email in an HTML-capable email client for the full report.`,
    })

    if (result.error) {
      logger.error('Resend send error', result.error)
      return { ok: false }
    }

    logger.info('Audit email sent', { to, id: result.data?.id })
    return { ok: true, id: result.data?.id }
  } catch (err) {
    logger.error('Resend exception', err)
    return { ok: false }
  }
}
