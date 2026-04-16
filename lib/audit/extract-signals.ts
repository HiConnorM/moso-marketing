import type { SiteSignals } from '../../types/audit'

export function extractSignals(html: string, siteUrl: string): SiteSignals {
  const origin = (() => {
    try {
      return new URL(siteUrl).origin
    } catch {
      return siteUrl
    }
  })()

  // --- Meta ---
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? null
  const metaDescription =
    html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']{1,500})["']/i
    )?.[1] ??
    html.match(
      /<meta[^>]*content=["']([^"']{1,500})["'][^>]*name=["']description["']/i
    )?.[1] ??
    null

  // --- Headings ---
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
    stripTags(m[1])
  )
  const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) =>
    stripTags(m[1])
  )

  // --- Structured data ---
  const allSchemas = [...html.matchAll(/"@type"\s*:\s*"([^"]+)"/gi)].map(
    (m) => m[1]
  )
  const structuredDataTypes = [...new Set(allSchemas)]
  const hasFaqSchema = structuredDataTypes.some((t) =>
    /FAQPage/i.test(t)
  )
  const hasOrganizationSchema = structuredDataTypes.some((t) =>
    /Organization/i.test(t)
  )
  const hasLocalBusinessSchema = structuredDataTypes.some((t) =>
    /LocalBusiness/i.test(t)
  )
  const hasArticleSchema = structuredDataTypes.some((t) =>
    /Article|BlogPosting|NewsArticle/i.test(t)
  )
  const hasServiceSchema = structuredDataTypes.some((t) =>
    /Service/i.test(t)
  )
  const hasStructuredData = structuredDataTypes.length > 0

  // --- Canonical ---
  const canonical =
    html.match(
      /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i
    )?.[1] ?? null

  // --- Links ---
  const allLinks = [...html.matchAll(/href=["']([^"']+)["']/gi)].map(
    (m) => m[1]
  )
  const internalLinks = allLinks.filter(
    (l) =>
      l.startsWith('/') ||
      l.startsWith(origin) ||
      (!l.startsWith('http') && !l.startsWith('#') && !l.startsWith('mailto'))
  )

  // --- Open Graph & Twitter ---
  const hasOgTags = /<meta[^>]*property=["']og:/i.test(html)
  const hasTwitterCards = /<meta[^>]*name=["']twitter:/i.test(html)

  // --- HTTPS ---
  const isHttps = siteUrl.startsWith('https://')

  // --- CTAs ---
  const ctaPatterns =
    /\b(get started|contact us|book a call|schedule|request|free|quote|demo|sign up|learn more|start now|try free|get a quote|book now)\b/gi
  const ctaMatches = html.match(ctaPatterns) ?? []
  const ctaCount = ctaMatches.length

  // --- Contact signals ---
  const hasPhoneNumber =
    /(\+1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}/.test(html)
  const hasAddress =
    /\d+\s+\w+\s+(street|st|avenue|ave|road|rd|blvd|boulevard|lane|ln|drive|dr|way|court|ct)/i.test(
      html
    )

  // --- Images ---
  const imgTags = [...html.matchAll(/<img[^>]+>/gi)].map((m) => m[0])
  const imageCount = imgTags.length
  const imagesWithAlt = imgTags.filter((tag) =>
    /alt=["'][^"']+["']/i.test(tag)
  ).length
  const imagesWithoutAlt = imageCount - imagesWithAlt

  // --- Word count (rough estimate) ---
  const textContent = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const wordCount = textContent.split(' ').filter((w) => w.length > 2).length

  return {
    url: siteUrl,
    title,
    titleLength: title?.length ?? 0,
    metaDescription,
    metaDescriptionLength: metaDescription?.length ?? 0,
    h1s,
    h2s,
    hasFaqSchema,
    hasOrganizationSchema,
    hasLocalBusinessSchema,
    hasArticleSchema,
    hasServiceSchema,
    structuredDataTypes,
    canonical,
    internalLinksCount: internalLinks.length,
    sampleInternalLinks: internalLinks.slice(0, 20),
    hasOgTags,
    hasTwitterCards,
    hasStructuredData,
    robotsStatus: null,
    robotsContent: null,
    sitemapFound: false,
    sitemapUrl: null,
    isHttps,
    ctaCount,
    hasPhoneNumber,
    hasAddress,
    wordCount,
    imageCount,
    imagesWithAlt,
    imagesWithoutAlt,
  }
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim()
}
