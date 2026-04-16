import type { CategoryScores, SiteSignals, PageSpeedResult } from '../../types/audit'

/**
 * Weights:
 *   Technical SEO:  25%
 *   Performance:    20%
 *   On-page SEO:    20%
 *   AEO Readiness:  20%
 *   UX/Conversion:  15%
 */
export function computeScores(
  signals: SiteSignals,
  mobile: PageSpeedResult,
  desktop: PageSpeedResult
): { categoryScores: CategoryScores; overallScore: number } {
  const technicalSeo = scoreTechnicalSeo(signals)
  const performance = scorePerformance(mobile, desktop)
  const onPageSeo = scoreOnPageSeo(signals)
  const aeoReadiness = scoreAeoReadiness(signals)
  const uxConversion = scoreUxConversion(signals, mobile)

  const overallScore = Math.round(
    technicalSeo * 0.25 +
      performance * 0.2 +
      onPageSeo * 0.2 +
      aeoReadiness * 0.2 +
      uxConversion * 0.15
  )

  return {
    categoryScores: { technicalSeo, performance, onPageSeo, aeoReadiness, uxConversion },
    overallScore,
  }
}

function clamp(v: number) {
  return Math.min(100, Math.max(0, Math.round(v)))
}

function scoreTechnicalSeo(s: SiteSignals): number {
  let score = 0
  if (s.isHttps) score += 15
  if (s.canonical) score += 8
  if (s.robotsStatus === 200) score += 8
  if (s.sitemapFound) score += 8
  if (s.title) score += 10
  if (s.metaDescription) score += 10
  if (s.h1s.length === 1) score += 12
  else if (s.h1s.length > 1) score += 4
  if (s.hasOgTags) score += 8
  if (s.hasStructuredData) score += 10
  if (s.internalLinksCount >= 5) score += 6
  if (s.imageCount > 0 && s.imagesWithoutAlt === 0) score += 5
  else if (s.imageCount > 0 && s.imagesWithAlt / s.imageCount > 0.7) score += 3
  return clamp(score)
}

function scorePerformance(mobile: PageSpeedResult, desktop: PageSpeedResult): number {
  // Weighted: mobile carries 60%, desktop 40%
  return clamp(mobile.performance * 0.6 + desktop.performance * 0.4)
}

function scoreOnPageSeo(s: SiteSignals): number {
  let score = 0
  // Title quality
  if (s.titleLength >= 30 && s.titleLength <= 60) score += 20
  else if (s.titleLength > 0) score += 10
  // Description quality
  if (s.metaDescriptionLength >= 120 && s.metaDescriptionLength <= 160) score += 20
  else if (s.metaDescriptionLength > 0) score += 10
  // H1
  if (s.h1s.length === 1) score += 20
  // H2s
  if (s.h2s.length >= 2) score += 10
  // Content depth
  if (s.wordCount >= 600) score += 20
  else if (s.wordCount >= 300) score += 10
  // Alt text
  if (s.imageCount > 0) {
    const altRatio = s.imagesWithAlt / s.imageCount
    score += Math.round(altRatio * 10)
  } else {
    score += 10
  }
  return clamp(score)
}

function scoreAeoReadiness(s: SiteSignals): number {
  let score = 0
  if (s.hasFaqSchema) score += 20
  if (s.hasOrganizationSchema || s.hasLocalBusinessSchema) score += 20
  if (s.h2s.length >= 3) score += 15
  if (s.wordCount >= 500) score += 15
  if (s.hasPhoneNumber || s.hasAddress) score += 15
  if (s.structuredDataTypes.length >= 2) score += 15
  return clamp(score)
}

function scoreUxConversion(s: SiteSignals, mobile: PageSpeedResult): number {
  let score = 0
  if (s.ctaCount >= 2) score += 30
  else if (s.ctaCount === 1) score += 15
  if (s.hasPhoneNumber) score += 20
  if (mobile.performance >= 70) score += 25
  else if (mobile.performance >= 50) score += 12
  if (s.imageCount > 0 && s.imagesWithAlt / s.imageCount > 0.8) score += 25
  else score += 10
  return clamp(score)
}

export function classifyLeadTemperature(
  score: number
): 'hot' | 'warm' | 'cold' {
  if (score >= 75) return 'cold'  // site is already decent — harder sell
  if (score >= 45) return 'warm'
  return 'hot'                    // site has serious issues — easiest sell
}
