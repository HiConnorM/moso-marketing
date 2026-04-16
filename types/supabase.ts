// Supabase database types for moso-marketing.
// Regenerate from Supabase dashboard: Settings → API → Generate TypeScript types

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      audit_leads: {
        Row: {
          id: string
          name: string | null
          email: string
          business_name: string | null
          website_url: string
          notes: string | null
          source: string
          status: string
          score: number | null
          category: string | null
          crm_synced: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          email: string
          business_name?: string | null
          website_url: string
          notes?: string | null
          source?: string
          status?: string
          score?: number | null
          category?: string | null
          crm_synced?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string
          business_name?: string | null
          website_url?: string
          notes?: string | null
          source?: string
          status?: string
          score?: number | null
          category?: string | null
          crm_synced?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_audits: {
        Row: {
          id: string
          lead_id: string
          website_url: string
          raw_results: Json
          ai_report: Json
          html_report: string
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          website_url: string
          raw_results: Json
          ai_report: Json
          html_report: string
          completed_at: string
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          website_url?: string
          raw_results?: Json
          ai_report?: Json
          html_report?: string
          completed_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'site_audits_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'audit_leads'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
