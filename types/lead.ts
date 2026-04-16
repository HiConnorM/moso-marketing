import type { AuditStatus } from './audit'

export interface AuditLead {
  id: string
  created_at: string
  name: string | null
  email: string
  business_name: string | null
  website_url: string
  notes: string | null
  source: string
  status: AuditStatus
  score: number | null
  category: string | null
  crm_synced: boolean
}

export interface AuditLeadInsert {
  name?: string
  email: string
  business_name?: string
  website_url: string
  notes?: string
  source?: string
}

export interface AuditSubmitPayload {
  name?: string
  email: string
  businessName?: string
  websiteUrl: string
  notes?: string
}
