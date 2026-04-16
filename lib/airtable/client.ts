import Airtable from 'airtable'
import { getEnv } from '../utils/env'

let base: ReturnType<InstanceType<typeof Airtable>['base']> | null = null

function getBase() {
  if (!base) {
    const airtable = new Airtable({ apiKey: getEnv('AIRTABLE_API_KEY') })
    base = airtable.base(getEnv('AIRTABLE_BASE_ID'))
  }
  return base
}

export function getContactsTable() {
  return getBase()('Contacts')
}

export function getSignalsTable() {
  return getBase()('Signals')
}
