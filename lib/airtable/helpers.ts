import { getContactsTable } from './client'
import { logger } from '../utils/logger'

/**
 * Find an existing Airtable Contact record by email address.
 * Returns the record ID if found, or null if not found / on error.
 */
export async function findContactByEmail(email: string): Promise<string | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contacts = getContactsTable() as any
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
