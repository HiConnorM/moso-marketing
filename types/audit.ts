export interface PageSpeedResult {
  performance: number
  accessibility: number
  seo: number
  bestPractices: number
  fcp: number | null
  lcp: number | null
  cls: number | null
  tbt: number | null
  si: number | null
}

export interface SiteSignals {
  url: string
  title: string | null
  titleLength: number
  metaDescription: string | null
  metaDescriptionLength: number
  h1s: string[]
  h2s: string[]
  hasFaqSchema: boolean
  hasOrganizationSchema: boolean
  hasLocalBusinessSchema: boolean
  hasArticleSchema: boolean
  hasServiceSchema: boolean
  structuredDataTypes: string[]
  canonical: string | null
  internalLinksCount: number
  sampleInternalLinks: string[]
  hasOgTags: boolean
  hasTwitterCards: boolean
  hasStructuredData: boolean
  robotsStatus: number | null
  robotsContent: string | null
  sitemapFound: boolean
  sitemapUrl: string | null
  isHttps: boolean
  ctaCount: number
  hasPhoneNumber: boolean
  hasAddress: boolean
  wordCount: number
  imageCount: number
  imagesWithAlt: number
  imagesWithoutAlt: number
}

export interface CategoryScores {
  technicalSeo: number
  performance: number
  onPageSeo: number
  aeoReadiness: number
  uxConversion: number
}

export interface AuditRawResults {
  url: string
  mobile: PageSpeedResult
  desktop: PageSpeedResult
  signals: SiteSignals
  categoryScores: CategoryScores
  overallScore: number
  auditedAt: string
}

export interface AuditRecommendation {
  priority: 'high' | 'medium' | 'low'
  category: string
  issue: string
  recommendation: string
  effort: 'low' | 'medium' | 'high'
  impact: 'low' | 'medium' | 'high'
}

export interface AIReport {
  executiveSummary: string
  overallScore: number
  categoryScores: CategoryScores
  categoryLabels: {
    technicalSeo: string
    performance: string
    onPageSeo: string
    aeoReadiness: string
    uxConversion: string
  }
  topFindings: string[]
  quickWins: AuditRecommendation[]
  biggestBlockers: AuditRecommendation[]
  prioritizedRoadmap: AuditRecommendation[]
  recommendedMosoService: string
  ctaMessage: string
  leadTemperature: 'hot' | 'warm' | 'cold'
  recommendedOffer: string
  auditSummaryForCrm: string
}

export interface SiteAudit {
  id: string
  lead_id: string
  created_at: string
  website_url: string
  raw_results: AuditRawResults
  ai_report: AIReport | null
  html_report: string | null
  pdf_url: string | null
  completed_at: string | null
}

export type AuditStatus = 'queued' | 'running' | 'completed' | 'failed'
