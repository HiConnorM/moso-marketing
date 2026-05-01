import type { CategoryScores, SiteSignals, PageSpeedResult, TeaserResults } from '../../types/audit'

/**
 * Overall weights:
 *   SEO  35%  — technical + on-page foundation
 *   AEO  25%  — answer-engine readiness
 *   GEO  25%  — generative engine / entity clarity
 *   UX   15%  — conversion & trust
 */
export function computeScores(
  signals: SiteSignals,
  mobile: PageSpeedResult,
  desktop: PageSpeedResult
): { categoryScores: CategoryScores; overallScore: number } {
  const seo = scoreSeo(signals, mobile, desktop)
  const aeo = scoreAeo(signals)
  const geo = scoreGeo(signals)
  const ux  = scoreUx(signals, mobile)

  const overallScore = Math.round(
    seo * 0.35 + aeo * 0.25 + geo * 0.25 + ux * 0.15
  )

  return { categoryScores: { seo, aeo, geo, ux }, overallScore }
}

function clamp(v: number) {
  return Math.min(100, Math.max(0, Math.round(v)))
}

// ── SEO (35%) ─────────────────────────────────────────────────────────────────
// Metadata: 15 pts | Indexability: 15 pts | Heading structure: 10 pts
// Content depth: 15 pts | Internal links: 10 pts | Image optimisation: 5 pts
// Schema: 10 pts | Performance/mobile: 15 pts | Local signals: 5 pts  → 100
function scoreSeo(
  s: SiteSignals,
  mobile: PageSpeedResult,
  desktop: PageSpeedResult
): number {
  let score = 0

  // Metadata (15)
  if (s.titleLength >= 30 && s.titleLength <= 60) score += 10
  else if (s.titleLength > 0) score += 5
  if (s.metaDescriptionLength >= 120 && s.metaDescriptionLength <= 160) score += 5
  else if (s.metaDescriptionLength > 0) score += 2

  // Indexability / crawlability (15)
  if (s.isHttps) score += 4
  if (s.canonical) score += 3
  if (s.robotsStatus === 200) score += 3
  if (s.sitemapFound) score += 3
  if (s.hasOgTags) score += 2

  // Heading structure (10)
  if (s.h1s.length === 1) score += 7
  else if (s.h1s.length > 1) score += 2
  if (s.h2s.length >= 2) score += 2
  if (s.h3Count >= 1) score += 1

  // Content depth / relevance (15)
  if (s.wordCount >= 800) score += 15
  else if (s.wordCount >= 500) score += 10
  else if (s.wordCount >= 300) score += 6

  // Internal links (10)
  if (s.internalLinksCount >= 10) score += 10
  else if (s.internalLinksCount >= 5) score += 6
  else if (s.internalLinksCount >= 2) score += 3

  // Image optimisation (5)
  if (s.imageCount > 0) {
    const ratio = s.imagesWithAlt / s.imageCount
    score += Math.round(ratio * 5)
  } else {
    score += 5
  }

  // Structured data (10)
  if (s.hasStructuredData) score += 5
  if (s.structuredDataTypes.length >= 2) score += 3
  if (s.hasOrganizationSchema || s.hasLocalBusinessSchema) score += 2

  // Performance / mobile (15)
  const perfScore = mobile.performance * 0.6 + desktop.performance * 0.4
  score += Math.round((perfScore / 100) * 15)

  // Local signals (5)
  if (s.hasPhoneNumber) score += 2
  if (s.hasAddress) score += 2
  if (s.hasLocalBusinessSchema) score += 1

  return clamp(score)
}

// ── AEO (25%) ─────────────────────────────────────────────────────────────────
// FAQ / question content: 15 | Direct answers / definitions: 15
// Conversational headings: 10 | Schema support: 15
// Content depth / helpfulness: 15 | Snippet-ready formatting: 10
// Trust / proof near answers: 10 | Local / service intent clarity: 10 → 100
function scoreAeo(s: SiteSignals): number {
  let score = 0

  // FAQ / question content (15)
  if (s.hasFaqSchema) score += 15
  else if (s.hasDefinitions) score += 6

  // Direct answers / definitions (15)
  if (s.hasDefinitions) score += 8
  if (s.wordCount >= 500) score += 4
  if (s.h2s.length >= 2) score += 3

  // Conversational headings — h2/h3 depth (10)
  if (s.h2s.length >= 4) score += 10
  else if (s.h2s.length >= 2) score += 6
  else if (s.h2s.length >= 1) score += 3

  // Schema support (15)
  if (s.hasFaqSchema) score += 5
  if (s.hasOrganizationSchema || s.hasLocalBusinessSchema) score += 4
  if (s.hasServiceSchema) score += 3
  if (s.hasBreadcrumbSchema) score += 2
  if (s.hasArticleSchema) score += 1

  // Content depth / helpfulness (15)
  if (s.wordCount >= 1000) score += 15
  else if (s.wordCount >= 600) score += 10
  else if (s.wordCount >= 300) score += 5

  // Snippet-ready formatting (10)
  if (s.hasProcessContent) score += 5
  if (s.hasComparisonContent) score += 3
  if (s.h3Count >= 2) score += 2

  // Trust / proof near answers (10)
  if (s.hasTestimonials) score += 5
  if (s.hasCaseStudies) score += 3
  if (s.hasCredentials) score += 2

  // Local / service intent clarity (10)
  if (s.hasPhoneNumber || s.hasAddress) score += 5
  if (s.hasServicePages) score += 3
  if (s.namedServicesCount >= 2) score += 2

  return clamp(score)
}

// ── GEO (25%) ─────────────────────────────────────────────────────────────────
// Entity clarity: 20 | Structured data / entity markup: 15
// AI-readable content structure: 15 | Trust / citation signals: 15
// Brand authority / content depth: 10 | Consistency: 10
// Generative summary quality: 10 | Retrieval / crawl access: 5 → 100
function scoreGeo(s: SiteSignals): number {
  let score = 0

  // Entity clarity (20): can machines understand who you are?
  if (s.title) score += 3
  if (s.brandNameInTitle) score += 2
  if (s.brandNameInH1) score += 3
  if (s.namedServicesCount >= 3) score += 4
  else if (s.namedServicesCount >= 1) score += 2
  if (s.hasLocationContent || s.hasAddress) score += 4
  if (s.h1s.length === 1 && s.h1s[0].length > 8) score += 4

  // Structured data / entity markup (15)
  if (s.hasOrganizationSchema) score += 4
  if (s.hasLocalBusinessSchema) score += 3
  if (s.hasServiceSchema) score += 2
  if (s.hasWebSiteSchema) score += 2
  if (s.hasBreadcrumbSchema) score += 2
  if (s.hasPersonSchema) score += 1
  if (s.hasArticleSchema) score += 1

  // AI-readable content structure (15)
  if (s.wordCount >= 600) score += 4
  else if (s.wordCount >= 300) score += 2
  if (s.h2s.length >= 3) score += 3
  if (s.h3Count >= 2) score += 2
  if (s.hasDefinitions) score += 3
  if (s.hasProcessContent) score += 2
  if (s.hasFaqSchema || s.hasDefinitions) score += 1

  // Trust / citation signals (15)
  if (s.hasTestimonials) score += 5
  if (s.hasCaseStudies) score += 4
  if (s.hasCredentials) score += 3
  if (s.hasExternalProfiles) score += 2
  if (s.hasReviewSchema) score += 1

  // Brand authority / content depth (10)
  if (s.hasBlogContent) score += 3
  if (s.hasFounderInfo) score += 3
  if (s.wordCount >= 1000) score += 2
  else if (s.wordCount >= 500) score += 1
  if (s.hasOgTags) score += 2

  // Consistency across site (10)
  if (s.hasAboutPage) score += 3
  if (s.hasContactPage) score += 2
  if (s.hasNapData) score += 3
  if (s.canonical) score += 2

  // Generative summary quality (10): could AI summarize this business?
  if (s.h1s.length === 1) score += 3
  if (s.metaDescription && s.metaDescriptionLength >= 100) score += 3
  if (s.namedServicesCount >= 1 && s.hasLocationContent) score += 2
  if (s.hasServicePages && s.hasAboutPage) score += 2

  // Retrieval / crawl access (5)
  if (s.isHttps) score += 2
  if (s.sitemapFound) score += 2
  if (s.internalLinksCount >= 5) score += 1

  return clamp(score)
}

// ── UX / Conversion / Trust (15%) ─────────────────────────────────────────────
function scoreUx(s: SiteSignals, mobile: PageSpeedResult): number {
  let score = 0

  // CTA clarity (30)
  if (s.ctaCount >= 3) score += 30
  else if (s.ctaCount === 2) score += 20
  else if (s.ctaCount === 1) score += 10

  // Contact accessibility (20)
  if (s.hasPhoneNumber) score += 10
  if (s.hasContactPage) score += 10

  // Mobile performance (25)
  if (mobile.performance >= 80) score += 25
  else if (mobile.performance >= 60) score += 15
  else if (mobile.performance >= 40) score += 8

  // Trust signals (25)
  if (s.hasTestimonials) score += 8
  if (s.hasCaseStudies) score += 5
  if (s.hasCredentials) score += 5
  if (s.imageCount > 0 && s.imagesWithAlt / s.imageCount > 0.8) score += 4
  if (s.hasExternalProfiles) score += 3

  return clamp(score)
}

// ── Teaser results ────────────────────────────────────────────────────────────

export function buildTeaserResults(
  scores: CategoryScores,
  overallScore: number,
  signals: SiteSignals
): TeaserResults {
  const { seo, aeo, geo, ux } = scores

  // Find strongest area
  const areas = [
    { label: 'SEO Foundation', score: seo },
    { label: 'AEO Readiness', score: aeo },
    { label: 'GEO Visibility', score: geo },
    { label: 'UX & Trust', score: ux },
  ]
  const strongest = areas.reduce((a, b) => (b.score > a.score ? b : a))
  const weakest   = areas.reduce((a, b) => (b.score < a.score ? b : a))

  // Strongest area copy
  const strongestCopy = describeStrength(strongest.label, signals)

  // Biggest blocker copy
  const blockerCopy = describeBlocker(weakest.label, signals)

  // 3 quick wins
  const quickWins = pickQuickWins(scores, signals)

  return {
    overallScore,
    seoScore: seo,
    aeoScore: aeo,
    geoScore: geo,
    uxScore: ux,
    strongestArea: strongestCopy,
    biggestBlocker: blockerCopy,
    quickWins,
  }
}

function describeStrength(area: string, s: SiteSignals): string {
  switch (area) {
    case 'SEO Foundation':
      if (s.isHttps && s.canonical && s.sitemapFound)
        return 'Your technical SEO foundation is solid — HTTPS, sitemap, and canonical tags are in place.'
      if (s.title && s.metaDescription)
        return 'Your website has clear page titles and descriptions, giving search engines a readable summary.'
      return 'Your website structure is crawlable and indexed properly by search engines.'
    case 'AEO Readiness':
      if (s.hasFaqSchema)
        return 'Your FAQ schema gives answer engines clear, structured content to surface directly.'
      if (s.hasDefinitions)
        return 'Your content includes clear, direct language that answer engines can extract and surface.'
      return 'Your content depth supports answer-engine visibility across key topics.'
    case 'GEO Visibility':
      if (s.hasOrganizationSchema || s.hasLocalBusinessSchema)
        return 'Your entity markup helps AI systems identify and categorize your business correctly.'
      if (s.hasTestimonials && s.hasAboutPage)
        return 'Your brand signals — About page, testimonials, and clear positioning — give AI systems context to reference you accurately.'
      return 'Your website provides enough entity clarity for AI systems to understand your business.'
    case 'UX & Trust':
      if (s.ctaCount >= 3)
        return 'Your website has clear calls-to-action that reduce friction for visitors ready to take the next step.'
      return 'Your contact information and trust signals are accessible, making it easy for visitors to connect.'
    default:
      return 'Your website has solid foundational signals in this area.'
  }
}

function describeBlocker(area: string, s: SiteSignals): string {
  switch (area) {
    case 'SEO Foundation':
      if (!s.hasStructuredData)
        return 'No structured data was detected — this limits how search engines understand and categorize your content.'
      if (!s.sitemapFound)
        return 'No sitemap was found, which may slow down how search engines discover your pages.'
      return 'Your SEO signals are incomplete — metadata, heading structure, or indexability needs attention.'
    case 'AEO Readiness':
      if (!s.hasFaqSchema && !s.hasDefinitions)
        return 'Your content lacks FAQ sections and direct answers, reducing your chances of appearing in answer-style search results.'
      return 'Your content is not structured for answer-engine formats — questions, definitions, and direct answers are missing.'
    case 'GEO Visibility':
      if (!s.hasOrganizationSchema && !s.hasLocalBusinessSchema)
        return 'Entity markup is missing — AI systems cannot confidently identify or categorize your business from structured data alone.'
      if (!s.hasTestimonials && !s.hasCaseStudies)
        return 'Your site lacks the trust and proof signals that generative AI systems rely on to recommend or reference a brand.'
      return 'Your brand and service entities are not fully reinforced with structured data and answer-ready content.'
    case 'UX & Trust':
      if (s.ctaCount < 2)
        return 'Your site has limited calls-to-action — visitors may reach your content without knowing how to take the next step.'
      return 'Trust signals near your conversion points are limited — testimonials, credentials, and contact info need strengthening.'
    default:
      return 'Visibility signals in this area need attention to improve search and AI discoverability.'
  }
}

function pickQuickWins(scores: CategoryScores, s: SiteSignals): string[] {
  const wins: string[] = []

  if (!s.hasOrganizationSchema && !s.hasLocalBusinessSchema)
    wins.push('Add Organization or LocalBusiness schema to your homepage to help search engines and AI identify your business.')

  if (!s.hasFaqSchema && scores.aeo < 60)
    wins.push('Add a FAQ section with structured markup to your key service pages.')

  if (s.h1s.length !== 1)
    wins.push(`Fix your H1 tags — ${s.h1s.length === 0 ? 'none detected' : s.h1s.length + ' found'}. Each page should have exactly one clear H1.`)

  if (!s.hasAboutPage)
    wins.push('Create or link a clear About page so search engines and AI can understand who you are and what you do.')

  if (!s.metaDescription)
    wins.push('Add a compelling meta description (120–160 chars) to every key page.')

  if (s.titleLength < 30 || s.titleLength > 60)
    wins.push('Rewrite your page title to be between 30–60 characters and clearly describe your business.')

  if (!s.hasTestimonials && scores.geo < 65)
    wins.push('Add client testimonials or case studies — these are trust signals AI systems use to evaluate brand credibility.')

  if (!s.canonical)
    wins.push('Add canonical tags to all key pages to prevent duplicate-content issues.')

  if (scores.geo < 60)
    wins.push('Rewrite your homepage intro to clearly state who you help, what you do, and where you serve.')

  // Return the 3 most relevant
  return wins.slice(0, 3)
}

// ── Lead quality scoring ──────────────────────────────────────────────────────

export function computeLeadQuality(
  overallScore: number,
  geoScore: number,
  challenge: string | null | undefined,
  industry: string | null | undefined,
  hasSchema: boolean,
  hasPhone: boolean
): { score: number; label: 'high-opportunity' | 'nurture' | 'optimization' } {
  let quality = 0

  if (overallScore < 70) quality += 20
  if (geoScore < 65) quality += 20

  const highIntentPhrases = /not (getting|showing)|no leads|not found|not ranking|slow|traffic|invisible/i
  if (challenge && highIntentPhrases.test(challenge)) quality += 20

  const highValueIndustries =
    /professional service|healthcare|legal|medical|dental|accounting|financial|hospitality|hotel|restaurant|real estate|contractor|plumbing|hvac|roofing|landscaping|local service/i
  if (industry && highValueIndustries.test(industry)) quality += 15

  if (!hasSchema) quality += 15
  if (hasPhone) quality += 10
  if (overallScore < 50) quality += 10

  const label =
    overallScore < 50
      ? 'high-opportunity'
      : overallScore <= 75
        ? 'nurture'
        : 'optimization'

  return { score: Math.min(quality, 100), label }
}

// ── Lead temperature (used by AI report) ─────────────────────────────────────

export function classifyLeadTemperature(score: number): 'hot' | 'warm' | 'cold' {
  if (score >= 75) return 'cold'
  if (score >= 45) return 'warm'
  return 'hot'
}
