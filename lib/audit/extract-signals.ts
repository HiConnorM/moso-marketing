import type { SiteSignals } from '../../types/audit'

export function extractSignals(html: string, siteUrl: string): SiteSignals {
  const origin = (() => {
    try {
      return new URL(siteUrl).origin
    } catch {
      return siteUrl
    }
  })()

  // ── Metadata ──────────────────────────────────────────────────────────────
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? null
  const metaDescription =
    html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']{1,500})["']/i)?.[1] ??
    html.match(/<meta[^>]*content=["']([^"']{1,500})["'][^>]*name=["']description["']/i)?.[1] ??
    null

  // ── Headings ──────────────────────────────────────────────────────────────
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => stripTags(m[1]))
  const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => stripTags(m[1]))
  const h3Count = (html.match(/<h3[^>]*>/gi) ?? []).length

  // ── Structured data ───────────────────────────────────────────────────────
  const allSchemas = [...html.matchAll(/"@type"\s*:\s*"([^"]+)"/gi)].map((m) => m[1])
  const structuredDataTypes = [...new Set(allSchemas)]
  const hasType = (pattern: RegExp) => structuredDataTypes.some((t) => pattern.test(t))

  const hasFaqSchema           = hasType(/FAQPage/i)
  const hasOrganizationSchema  = hasType(/^Organization$/i)
  const hasLocalBusinessSchema = hasType(/LocalBusiness/i)
  const hasArticleSchema       = hasType(/Article|BlogPosting|NewsArticle/i)
  const hasServiceSchema       = hasType(/^Service$/i)
  const hasPersonSchema        = hasType(/^Person$/i)
  const hasWebSiteSchema       = hasType(/^WebSite$/i)
  const hasBreadcrumbSchema    = hasType(/BreadcrumbList/i)
  const hasReviewSchema        = hasType(/Review|AggregateRating/i)
  const hasStructuredData      = structuredDataTypes.length > 0

  // ── Canonical ────────────────────────────────────────────────────────────
  const canonical =
    html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1] ?? null

  // ── Internal links ────────────────────────────────────────────────────────
  const allLinks = [...html.matchAll(/href=["']([^"']+)["']/gi)].map((m) => m[1])
  const internalLinks = allLinks.filter(
    (l) =>
      l.startsWith('/') ||
      l.startsWith(origin) ||
      (!l.startsWith('http') && !l.startsWith('#') && !l.startsWith('mailto'))
  )

  // ── Open Graph / Twitter ──────────────────────────────────────────────────
  const hasOgTags      = /<meta[^>]*property=["']og:/i.test(html)
  const hasTwitterCards = /<meta[^>]*name=["']twitter:/i.test(html)

  // ── HTTPS ─────────────────────────────────────────────────────────────────
  const isHttps = siteUrl.startsWith('https://')

  // ── CTAs ──────────────────────────────────────────────────────────────────
  const ctaPatterns =
    /\b(get started|contact us|book a call|schedule|request|free|quote|demo|sign up|learn more|start now|try free|get a quote|book now|let's talk|work with us|hire us|get in touch)\b/gi
  const ctaCount = (html.match(ctaPatterns) ?? []).length

  // ── Contact signals ───────────────────────────────────────────────────────
  const hasPhoneNumber =
    /(\+1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}/.test(html)
  const hasAddress =
    /\d+\s+\w+\s+(street|st|avenue|ave|road|rd|blvd|boulevard|lane|ln|drive|dr|way|court|ct)/i.test(html)

  // ── Images ────────────────────────────────────────────────────────────────
  const imgTags = [...html.matchAll(/<img[^>]+>/gi)].map((m) => m[0])
  const imageCount      = imgTags.length
  const imagesWithAlt   = imgTags.filter((tag) => /alt=["'][^"']+["']/i.test(tag)).length
  const imagesWithoutAlt = imageCount - imagesWithAlt

  // ── Word count ────────────────────────────────────────────────────────────
  const textContent = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const wordCount = textContent.split(' ').filter((w) => w.length > 2).length

  // ── GEO: trust & proof signals ────────────────────────────────────────────
  const lowerHtml = html.toLowerCase()

  const hasTestimonials =
    /testimonial|review|what (our|clients|customers) say|client (said|says|loves)|"[^"]{20,150}"\s*[-–]\s*\w/i.test(html)

  const hasCaseStudies =
    /case study|case studies|success story|success stories|client results|project results/i.test(html)

  const hasCredentials =
    /award|certified|certification|accredited|featured in|as seen in|press|media|recognition|member of/i.test(html)

  const hasFounderInfo =
    /\b(founder|co-founder|ceo|owner|principal|director|meet the team|about us|our story|our team)\b/i.test(html)

  // ── GEO: page structure ────────────────────────────────────────────────────
  const hasAboutPage =
    /href=["'][^"']*\/(about|about-us|our-story|who-we-are)[^"']*["']/i.test(html)

  const hasServicePages =
    /href=["'][^"']*\/(service|services|what-we-do|solutions|offerings)[^"']*["']/i.test(html)

  const hasContactPage =
    /href=["'][^"']*\/(contact|contact-us|get-in-touch|reach-us)[^"']*["']/i.test(html)

  const hasBlogContent =
    /href=["'][^"']*\/(blog|insights|articles|resources|news|posts)[^"']*["']/i.test(html)

  // ── GEO: content type signals ─────────────────────────────────────────────
  const hasDefinitions =
    /what is\b|what are\b|definition of\b|means that\b|refers to\b/i.test(html)

  const hasProcessContent =
    /how (it works|we work|our process)|step [0-9]|step-by-step|our approach|our method/i.test(html)

  const hasLocationContent =
    /serving|we serve|located in|based in|service area|our location|near you/i.test(html)

  const hasComparisonContent =
    /vs\.|versus|compared to|the difference between|why choose us|why work with|alternatives/i.test(html)

  // Named services: count distinct service-like phrases (rough heuristic)
  const serviceMatches = html.match(
    /\b(web design|web development|seo|branding|marketing|photography|consulting|coaching|plumbing|roofing|landscaping|accounting|legal|therapy|dentist|medical|hvac|cleaning|painting|remodeling|catering|flooring|electrician|real estate|insurance|financial|software|mobile app|e-commerce|shopify|wordpress)\b/gi
  )
  const namedServicesCount = new Set((serviceMatches ?? []).map((s) => s.toLowerCase())).size

  // ── GEO: brand entity consistency ────────────────────────────────────────
  // Extract candidate brand name from title (text before "|" or "—" or "-")
  const brandFromTitle = title?.split(/[|\-–—]/)[0]?.trim().toLowerCase() ?? ''
  const brandNameInTitle = brandFromTitle.length > 2

  const brandNameInH1 =
    brandFromTitle.length > 2 &&
    h1s.some((h) => h.toLowerCase().includes(brandFromTitle))

  const hasNapData = hasPhoneNumber && hasAddress

  // External profiles (LinkedIn, Google, Yelp, Facebook, Instagram, etc.)
  const hasExternalProfiles =
    /linkedin\.com|facebook\.com|instagram\.com|twitter\.com|x\.com|yelp\.com|google\.com\/maps|g\.page|houzz\.com|angi\.com/i.test(
      html
    )

  return {
    url: siteUrl,
    title,
    titleLength: title?.length ?? 0,
    metaDescription,
    metaDescriptionLength: metaDescription?.length ?? 0,
    h1s,
    h2s,
    h3Count,
    hasFaqSchema,
    hasOrganizationSchema,
    hasLocalBusinessSchema,
    hasArticleSchema,
    hasServiceSchema,
    hasPersonSchema,
    hasWebSiteSchema,
    hasBreadcrumbSchema,
    hasReviewSchema,
    structuredDataTypes,
    hasStructuredData,
    canonical,
    internalLinksCount: internalLinks.length,
    sampleInternalLinks: internalLinks.slice(0, 20),
    hasOgTags,
    hasTwitterCards,
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
    hasTestimonials,
    hasCaseStudies,
    hasAboutPage,
    hasServicePages,
    hasContactPage,
    hasBlogContent,
    hasDefinitions,
    hasProcessContent,
    hasLocationContent,
    hasComparisonContent,
    namedServicesCount,
    brandNameInTitle,
    brandNameInH1,
    hasNapData,
    hasExternalProfiles,
    hasCredentials,
    hasFounderInfo,
  }
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim()
}
