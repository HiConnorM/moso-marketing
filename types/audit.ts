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
  // ── Metadata ──────────────────────────────────────────────────
  title: string | null
  titleLength: number
  metaDescription: string | null
  metaDescriptionLength: number
  // ── Headings ──────────────────────────────────────────────────
  h1s: string[]
  h2s: string[]
  h3Count: number
  // ── Structured data ───────────────────────────────────────────
  hasFaqSchema: boolean
  hasOrganizationSchema: boolean
  hasLocalBusinessSchema: boolean
  hasArticleSchema: boolean
  hasServiceSchema: boolean
  hasPersonSchema: boolean
  hasWebSiteSchema: boolean
  hasBreadcrumbSchema: boolean
  hasReviewSchema: boolean
  structuredDataTypes: string[]
  hasStructuredData: boolean
  // ── Crawlability / technical ──────────────────────────────────
  canonical: string | null
  internalLinksCount: number
  sampleInternalLinks: string[]
  hasOgTags: boolean
  hasTwitterCards: boolean
  robotsStatus: number | null
  robotsContent: string | null
  sitemapFound: boolean
  sitemapUrl: string | null
  isHttps: boolean
  // ── Content signals ────────────────────────────────────────────
  ctaCount: number
  hasPhoneNumber: boolean
  hasAddress: boolean
  wordCount: number
  imageCount: number
  imagesWithAlt: number
  imagesWithoutAlt: number
  // ── GEO / entity clarity signals ──────────────────────────────
  hasTestimonials: boolean
  hasCaseStudies: boolean
  hasAboutPage: boolean
  hasServicePages: boolean
  hasContactPage: boolean
  hasBlogContent: boolean
  hasDefinitions: boolean
  hasProcessContent: boolean
  hasLocationContent: boolean
  hasComparisonContent: boolean
  namedServicesCount: number
  brandNameInTitle: boolean
  brandNameInH1: boolean
  hasNapData: boolean           // name + address + phone all present
  hasExternalProfiles: boolean  // LinkedIn, Google Business, etc.
  hasCredentials: boolean       // awards, certifications, press
  hasFounderInfo: boolean       // team/founder page or bio
}

// ── Score shapes ──────────────────────────────────────────────────────────────

export interface CategoryScores {
  seo: number
  aeo: number
  geo: number
  ux: number
}

export interface TeaserResults {
  overallScore: number
  seoScore: number
  aeoScore: number
  geoScore: number
  uxScore: number
  strongestArea: string
  biggestBlocker: string
  quickWins: string[]
}

// ── Raw / combined audit data ─────────────────────────────────────────────────

export interface AuditRawResults {
  url: string
  mobile: PageSpeedResult
  desktop: PageSpeedResult
  signals: SiteSignals
  categoryScores: CategoryScores
  overallScore: number
  teaserResults: TeaserResults
  auditedAt: string
}

// ── AI-generated report ───────────────────────────────────────────────────────

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
    seo: string
    aeo: string
    geo: string
    ux: string
  }
  topFindings: string[]
  seoFindings: string[]
  aeoFindings: string[]
  geoFindings: string[]
  uxFindings: string[]
  quickWins: AuditRecommendation[]
  biggestBlockers: AuditRecommendation[]
  prioritizedRoadmap: AuditRecommendation[]
  sevenDayPlan: string[]
  thirtyDayPlan: string[]
  ninetyDayPlan: string[]
  recommendedMosoService: string
  ctaMessage: string
  leadTemperature: 'hot' | 'warm' | 'cold'
  recommendedOffer: string
  auditSummaryForCrm: string
}

// ── Database record shapes ────────────────────────────────────────────────────

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

export type AuditStatus =
  | 'queued'
  | 'running'
  | 'teaser_ready'
  | 'email_sent'
  | 'completed'   // legacy from old flow
  | 'failed'
