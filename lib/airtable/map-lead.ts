import type { AIReport } from '../../types/audit'
import { getContactsTable, getSignalsTable } from './client'
import { findContactByEmail } from './helpers'
import { logger } from '../utils/logger'

// ── Types ─────────────────────────────────────────────────────────────────────

interface LeadForAirtable {
  email: string
  name?: string | null
  first_name?: string | null
  business_name?: string | null
  website_url: string
  notes?: string | null
  industry?: string | null
  phone?: string | null
  score?: number | null
  geo_score?: number | null
  lead_quality_label?: string | null
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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

function getFirstName(lead: LeadForAirtable): string {
  if (lead.first_name) return lead.first_name
  if (lead.name) {
    const parts = lead.name.trim().split(/\s+/)
    return parts[0] ?? ''
  }
  return ''
}

function getLastName(lead: LeadForAirtable): string {
  if (lead.name) {
    const parts = lead.name.trim().split(/\s+/)
    return parts.length > 1 ? parts.slice(1).join(' ') : ''
  }
  return ''
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function upsertAirtableLead(
  lead: LeadForAirtable,
  report: AIReport | null
): Promise<void> {
  try {
    const contacts = getContactsTable()
    const signals  = getSignalsTable()

    const score   = lead.score ?? 0
    const temp    = report?.leadTemperature ?? 'warm'
    const first   = getFirstName(lead)
    const last    = getLastName(lead)

    const existingId = await findContactByEmail(lead.email)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contactsAny = contacts as any
    let contactId: string

    if (existingId) {
      await contactsAny.update(existingId, {
        'Website URL':            lead.website_url,
        'Last Interaction Date':  new Date().toISOString().split('T')[0],
        'Audit Score':            score,
        'Lead Temperature':       temp.charAt(0).toUpperCase() + temp.slice(1),
        'Recommended Offer':      report?.recommendedOffer ?? '',
        'Audit Summary':          report?.auditSummaryForCrm ?? '',
        ...(lead.industry ? { 'Industry': lead.industry } : {}),
        ...(lead.geo_score != null ? { 'GEO Score': lead.geo_score } : {}),
        ...(lead.lead_quality_label ? { 'Lead Quality': lead.lead_quality_label } : {}),
        ...(lead.phone ? { 'Phone': lead.phone } : {}),
      })
      contactId = existingId
      logger.info('Airtable contact updated', { contactId, email: lead.email })
    } else {
      const created = await contactsAny.create({
        'First Name':             first,
        'Last Name':              last,
        'Email Address':          lead.email,
        'Company Name':           lead.business_name ?? '',
        'Website URL':            lead.website_url,
        'Source':                 'Free Audit Tool',
        'Last Interaction Date':  new Date().toISOString().split('T')[0],
        'Notes':                  lead.notes ?? '',
        'Audit Score':            score,
        'Lead Temperature':       temp.charAt(0).toUpperCase() + temp.slice(1),
        'Recommended Offer':      report?.recommendedOffer ?? '',
        'Audit Summary':          report?.auditSummaryForCrm ?? '',
        ...(lead.industry ? { 'Industry': lead.industry } : {}),
        ...(lead.geo_score != null ? { 'GEO Score': lead.geo_score } : {}),
        ...(lead.lead_quality_label ? { 'Lead Quality': lead.lead_quality_label } : {}),
        ...(lead.phone ? { 'Phone': lead.phone } : {}),
      })
      contactId = created.id
      logger.info('Airtable contact created', { contactId, email: lead.email })
    }

    // Create Signal record linked to the contact
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (signals as any).create({
      'Contact':           [{ id: contactId }],
      'Action Taken':      'Free SEO+AEO+GEO Audit Submitted',
      'Knows MOSO?':       'No',
      'Problem Awareness': getProblemAwareness(score),
      'Urgency':           getUrgency(temp),
      'Audit Score':       score,
    })

    logger.info('Airtable signal created', { contactId })
  } catch (err) {
    logger.error('Airtable upsert failed', err)
    // Non-fatal — email was already sent
  }
}
