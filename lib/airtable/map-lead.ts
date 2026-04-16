import type { AuditLead } from '../../types/lead'
import type { AIReport } from '../../types/audit'
import { getContactsTable, getSignalsTable } from './client'
import { logger } from '../utils/logger'

// ─── Helpers ────────────────────────────────────────────────

function splitName(fullName: string | null): { first: string; last: string } {
  if (!fullName?.trim()) return { first: '', last: '' }
  const parts = fullName.trim().split(/\s+/)
  return {
    first: parts[0],
    last: parts.length > 1 ? parts.slice(1).join(' ') : '',
  }
}

function getProblemAwareness(score: number): string {
  if (score < 45) return 'High'
  if (score < 75) return 'Medium'
  return 'Low'
}

function getUrgency(temp: 'hot' | 'warm' | 'cold'): string {
  if (temp === 'hot') return 'High'
  if (temp === 'warm') return 'Medium'
  return 'Low'
}

// ─── Find existing contact by email ─────────────────────────

async function findContactByEmail(email: string): Promise<string | null> {
  try {
    const contacts = getContactsTable()
    const records = await contacts
      .select({
        filterByFormula: `{Email Address} = "${email.replace(/"/g, '\\"')}"`,
        maxRecords: 1,
        fields: ['Email Address'],
      })
      .firstPage()

    return records.length > 0 ? records[0].id : null
  } catch (err) {
    logger.warn('Airtable contact lookup failed', err)
    return null
  }
}

// ─── Main export ─────────────────────────────────────────────

export async function upsertAirtableLead(
  lead: AuditLead,
  report: AIReport | null
): Promise<void> {
  try {
    const contacts = getContactsTable()
    const signals = getSignalsTable()
    const { first, last } = splitName(lead.name)
    const score = lead.score ?? 0
    const temp = report?.leadTemperature ?? 'warm'

    // 1. Find or create the Contact record
    const existingId = await findContactByEmail(lead.email)

    let contactId: string

    if (existingId) {
      // Update existing contact with audit data
      await contacts.update(existingId, {
        'Website URL': lead.website_url,
        'Last Interaction Date': new Date().toISOString().split('T')[0],
        'Audit Score': score,
        'Lead Temperature': temp.charAt(0).toUpperCase() + temp.slice(1),
        'Recommended Offer': report?.recommendedOffer ?? '',
        'Audit Summary': report?.auditSummaryForCrm ?? '',
      })
      contactId = existingId
      logger.info('Airtable contact updated', { contactId, email: lead.email })
    } else {
      // Create new contact
      const created = await contacts.create({
        'First Name': first,
        'Last Name': last,
        'Email Address': lead.email,
        'Company Name': lead.business_name ?? '',
        'Website URL': lead.website_url,
        'Source': 'Free Audit Tool',
        'Last Interaction Date': new Date().toISOString().split('T')[0],
        'Notes': lead.notes ?? '',
        'Audit Score': score,
        'Lead Temperature': temp.charAt(0).toUpperCase() + temp.slice(1),
        'Recommended Offer': report?.recommendedOffer ?? '',
        'Audit Summary': report?.auditSummaryForCrm ?? '',
      })
      contactId = created.id
      logger.info('Airtable contact created', { contactId, email: lead.email })
    }

    // 2. Create a Signal linked to the contact
    await signals.create({
      'Contact': [{ id: contactId }],
      'Action Taken': 'Free Audit Submitted',
      'Knows MOSO?': 'No',
      'Problem Awareness': getProblemAwareness(score),
      'Urgency': getUrgency(temp),
      'Audit Score': score,
    })

    logger.info('Airtable signal created', { contactId })

    // 3. Mark lead as CRM-synced in Supabase (best-effort, handled by caller)
  } catch (err) {
    logger.error('Airtable upsert failed', err)
    // Non-fatal — audit report was already sent, don't throw
  }
}
