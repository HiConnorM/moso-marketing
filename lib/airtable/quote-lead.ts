import { getContactsTable, getSignalsTable } from './client'
import { findContactByEmail } from './helpers'
import { fmtMoney, splitName } from '../utils/format'
import { logger } from '../utils/logger'
import type { QuoteAnswers, QuoteResult } from '../../types/quote'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildAuditSummary(answers: QuoteAnswers, result: QuoteResult): string {
  const lines: string[] = [
    `Package: ${result.packageName}`,
    `Range: ${fmtMoney(result.rangeMin)}–${fmtMoney(result.rangeMax)}`,
    `Timeline: ${result.timeline}`,
    `Budget selected: ${answers.budget}`,
    `Project goals: ${answers.buildGoals.join(', ')}`,
    `Stage: ${answers.stage}`,
    `Business type: ${answers.businessType}`,
    `Outcome: ${answers.outcome}`,
    `Monthly support interest: ${answers.monthlySupport}`,
    `Requested timeline: ${answers.timeline}`,
  ]
  if (answers.services.length > 0) lines.push(`Services: ${answers.services.join(', ')}`)
  if (answers.description) lines.push(`Notes: ${answers.description}`)
  return lines.join('\n')
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function upsertQuoteLead(
  answers: QuoteAnswers,
  result: QuoteResult
): Promise<void> {
  try {
    const contacts = getContactsTable()
    const signals  = getSignalsTable()

    const { first, last } = splitName(answers.contactName)
    const temp    = result.leadTemp.charAt(0).toUpperCase() + result.leadTemp.slice(1)
    const summary = buildAuditSummary(answers, result)

    // 1. Upsert Contact
    const existingId = await findContactByEmail(answers.contactEmail)
    let contactId: string

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contactsAny = contacts as any

    if (existingId) {
      await contactsAny.update(existingId, {
        'Website URL':            answers.websiteUrl || undefined,
        'Last Interaction Date':  new Date().toISOString().split('T')[0],
        'Lead Temperature':       temp,
        'Recommended Offer':      result.packageName,
        'Audit Summary':          summary,
        'Notes':                  answers.description || undefined,
      })
      contactId = existingId
      logger.info('Airtable quote contact updated', { contactId, email: answers.contactEmail })
    } else {
      const created = await contactsAny.create({
        'First Name':             first,
        'Last Name':              last,
        'Email Address':          answers.contactEmail,
        'Company Name':           answers.businessName || '',
        'Website URL':            answers.websiteUrl   || '',
        'Source':                 'Quote Builder',
        'Last Interaction Date':  new Date().toISOString().split('T')[0],
        'Notes':                  answers.description  || '',
        'Lead Temperature':       temp,
        'Recommended Offer':      result.packageName,
        'Audit Summary':          summary,
      })
      contactId = created.id
      logger.info('Airtable quote contact created', { contactId, email: answers.contactEmail })
    }

    // 2. Create Signal
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (signals as any).create({
      'Contact':          [{ id: contactId }],
      'Action Taken':     'Quote Builder Submitted',
      'Knows MOSO?':      'No',
      'Problem Awareness':'Medium',
      'Urgency':          result.leadTemp === 'hot' ? 'High' : result.leadTemp === 'warm' ? 'Medium' : 'Low',
      'Audit Score':      result.leadScore,
    })

    logger.info('Airtable quote signal created', { contactId })
  } catch (err) {
    logger.error('Airtable quote upsert failed', err)
    // Non-fatal
  }
}
