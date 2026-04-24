// ─── Shared Quote Builder types ───────────────────────────────────────────────
// Single source of truth used by the API route, email module, and Airtable module.

export interface QuoteAnswers {
  buildGoals: string[]
  stage: string
  businessType: string
  outcome: string
  services: string[]
  monthlySupport: string
  timeline: string
  budget: string
  contactName: string
  contactEmail: string
  businessName: string
  websiteUrl: string
  phone: string
  description: string
  wantsMOSOReview: boolean
}

export interface QuoteResult {
  packageName: string
  packageDesc: string
  rangeMin: number
  rangeMax: number
  monthlyPlanName: string
  monthlyMin: number
  monthlyMax: number
  timeline: string
  whatsIncluded: string[]
  leadScore: number
  leadTemp: 'hot' | 'warm' | 'cold'
}
