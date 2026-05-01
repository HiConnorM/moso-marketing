import type { AuditRawResults, AIReport } from '../../types/audit'
import { classifyLeadTemperature } from './scoring'
import { getEnv } from '../utils/env'
import { logger } from '../utils/logger'

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

export async function generateAIReport(
  raw: AuditRawResults,
  context?: {
    businessName?: string | null
    industry?: string | null
    challenge?: string | null
    firstName?: string | null
  }
): Promise<AIReport> {
  const prompt = buildPrompt(raw, context)

  try {
    const res = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getEnv('OPENAI_API_KEY')}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        temperature: 0.4,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You are a senior SEO, AEO, GEO, UX, and brand strategy auditor for MOSO, a design and technology studio. ' +
              'Your job is to turn structured website audit data into a clear, useful, business-owner-friendly report. ' +
              'Be specific to the website being audited — mention the actual domain, actual headings, and actual signals found. ' +
              'Do not guarantee rankings, traffic, AI citations, or placement. ' +
              'Use calm, premium, human language. ' +
              'Respond ONLY with a valid JSON object matching the schema provided.',
          },
          { role: 'user', content: prompt },
        ],
      }),
      signal: AbortSignal.timeout(60_000),
    })

    if (!res.ok) {
      throw new Error(`OpenAI API error: ${res.status}`)
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) throw new Error('No content in OpenAI response')

    const parsed = JSON.parse(content) as AIReport
    parsed.overallScore    = raw.overallScore
    parsed.categoryScores  = raw.categoryScores
    parsed.leadTemperature = classifyLeadTemperature(raw.overallScore)

    return parsed
  } catch (err) {
    logger.error('AI report generation failed', err)
    return fallbackReport(raw)
  }
}

function buildPrompt(
  raw: AuditRawResults,
  ctx?: { businessName?: string | null; industry?: string | null; challenge?: string | null; firstName?: string | null }
): string {
  const { signals, mobile, desktop, categoryScores, overallScore } = raw

  return `
You are generating a detailed SEO + AEO + GEO website audit report for a MOSO prospect.

BUSINESS CONTEXT:
Website: ${signals.url}
Business Name: ${ctx?.businessName ?? 'Unknown'}
Industry: ${ctx?.industry ?? 'Unknown'}
Biggest Challenge: ${ctx?.challenge ?? 'Not provided'}
Contact: ${ctx?.firstName ?? 'Not provided'}
Audit Date: ${raw.auditedAt}

--- SCORES ---
Overall Visibility Score: ${overallScore}/100
SEO Foundation: ${categoryScores.seo}/100  (weight: 35%)
AEO Readiness: ${categoryScores.aeo}/100  (weight: 25%)
GEO Visibility: ${categoryScores.geo}/100  (weight: 25%)
UX & Trust: ${categoryScores.ux}/100  (weight: 15%)

--- PERFORMANCE DATA ---
Mobile: Performance ${mobile.performance}, Accessibility ${mobile.accessibility}, SEO ${mobile.seo}, Best Practices ${mobile.bestPractices}
Desktop: Performance ${desktop.performance}, Accessibility ${desktop.accessibility}, SEO ${desktop.seo}
Mobile Core Web Vitals: LCP ${mobile.lcp ? (mobile.lcp / 1000).toFixed(2) + 's' : 'unknown'} | CLS ${mobile.cls ?? 'unknown'} | TBT ${mobile.tbt ? Math.round(mobile.tbt) + 'ms' : 'unknown'}

--- TECHNICAL SEO SIGNALS ---
HTTPS: ${signals.isHttps ? 'Yes' : 'No'}
Canonical tag: ${signals.canonical ?? 'Missing'}
robots.txt: ${signals.robotsStatus === 200 ? 'Found' : 'Not found or blocked'}
Sitemap: ${signals.sitemapFound ? signals.sitemapUrl ?? 'Found' : 'Not found'}
Open Graph tags: ${signals.hasOgTags ? 'Present' : 'Missing'}
Twitter Card: ${signals.hasTwitterCards ? 'Present' : 'Missing'}
Structured data types: ${signals.structuredDataTypes.length > 0 ? signals.structuredDataTypes.join(', ') : 'None detected'}
Internal links: ${signals.internalLinksCount}
Images: ${signals.imageCount} total, ${signals.imagesWithAlt} with alt text

--- ON-PAGE SIGNALS ---
Title: "${signals.title ?? 'Missing'}" (${signals.titleLength} chars)
Meta description: "${signals.metaDescription ?? 'Missing'}" (${signals.metaDescriptionLength} chars)
H1 tags (${signals.h1s.length}): ${signals.h1s.length > 0 ? signals.h1s.slice(0, 2).join(' | ') : 'None'}
H2 tags: ${signals.h2s.length} found${signals.h2s.length > 0 ? ' — e.g. "' + signals.h2s.slice(0, 3).join('", "') + '"' : ''}
H3 count: ${signals.h3Count}
Word count: ~${signals.wordCount}

--- AEO SIGNALS ---
FAQ schema: ${signals.hasFaqSchema ? 'Present' : 'Missing'}
Definitions / "What is" content: ${signals.hasDefinitions ? 'Present' : 'Not detected'}
Process / how-it-works content: ${signals.hasProcessContent ? 'Present' : 'Not detected'}
Comparison content: ${signals.hasComparisonContent ? 'Present' : 'Not detected'}
Organization schema: ${signals.hasOrganizationSchema ? 'Yes' : 'No'}
LocalBusiness schema: ${signals.hasLocalBusinessSchema ? 'Yes' : 'No'}
Service schema: ${signals.hasServiceSchema ? 'Yes' : 'No'}
Breadcrumb schema: ${signals.hasBreadcrumbSchema ? 'Yes' : 'No'}
Phone number visible: ${signals.hasPhoneNumber ? 'Yes' : 'No'}
Address visible: ${signals.hasAddress ? 'Yes' : 'No'}
Named services detected: ${signals.namedServicesCount}

--- GEO SIGNALS ---
Brand name in title: ${signals.brandNameInTitle ? 'Yes' : 'No'}
Brand name in H1: ${signals.brandNameInH1 ? 'Yes' : 'No'}
About page linked: ${signals.hasAboutPage ? 'Yes' : 'No'}
Service pages linked: ${signals.hasServicePages ? 'Yes' : 'No'}
Contact page linked: ${signals.hasContactPage ? 'Yes' : 'No'}
Blog / content library: ${signals.hasBlogContent ? 'Yes' : 'No'}
Testimonials detected: ${signals.hasTestimonials ? 'Yes' : 'No'}
Case studies detected: ${signals.hasCaseStudies ? 'Yes' : 'No'}
Awards / credentials: ${signals.hasCredentials ? 'Yes' : 'No'}
Founder / team info: ${signals.hasFounderInfo ? 'Yes' : 'No'}
External profiles (social, directories): ${signals.hasExternalProfiles ? 'Yes' : 'No'}
NAP data (Name+Address+Phone all present): ${signals.hasNapData ? 'Yes' : 'No'}
Location / service area content: ${signals.hasLocationContent ? 'Yes' : 'No'}
Organization schema: ${signals.hasOrganizationSchema ? 'Yes' : 'No'}
LocalBusiness schema: ${signals.hasLocalBusinessSchema ? 'Yes' : 'No'}
WebSite schema: ${signals.hasWebSiteSchema ? 'Yes' : 'No'}
Person schema: ${signals.hasPersonSchema ? 'Yes' : 'No'}
Review schema: ${signals.hasReviewSchema ? 'Yes' : 'No'}

--- UX / CONVERSION ---
CTA count: ${signals.ctaCount}
Phone number: ${signals.hasPhoneNumber ? 'Visible' : 'Not detected'}
Contact page: ${signals.hasContactPage ? 'Linked' : 'Not detected'}
Mobile performance: ${mobile.performance}/100

Respond ONLY with a valid JSON object in exactly this shape:
{
  "executiveSummary": "3-4 sentences. Specific to this website. What is working, what is failing, what the biggest opportunity is. Mention the domain.",
  "overallScore": ${overallScore},
  "categoryScores": {
    "seo": ${categoryScores.seo},
    "aeo": ${categoryScores.aeo},
    "geo": ${categoryScores.geo},
    "ux": ${categoryScores.ux}
  },
  "categoryLabels": {
    "seo": "SEO Foundation",
    "aeo": "AEO Readiness",
    "geo": "GEO Visibility",
    "ux": "UX & Trust"
  },
  "topFindings": ["string — specific finding about this site", "string", "string"],
  "seoFindings": ["string — specific SEO finding", "string", "string"],
  "aeoFindings": ["string — specific AEO finding about answer-readiness", "string", "string"],
  "geoFindings": ["string — specific GEO finding about entity/AI clarity", "string", "string"],
  "uxFindings": ["string — specific UX/conversion finding", "string"],
  "quickWins": [
    {
      "priority": "high",
      "category": "SEO|AEO|GEO|UX",
      "issue": "specific issue found on this site",
      "recommendation": "specific, actionable fix",
      "effort": "low|medium|high",
      "impact": "low|medium|high"
    }
  ],
  "biggestBlockers": [
    { "priority": "high", "category": "string", "issue": "string", "recommendation": "string", "effort": "low|medium|high", "impact": "low|medium|high" }
  ],
  "prioritizedRoadmap": [
    { "priority": "high|medium|low", "category": "string", "issue": "string", "recommendation": "string", "effort": "low|medium|high", "impact": "low|medium|high" }
  ],
  "sevenDayPlan": ["Action 1", "Action 2", "Action 3"],
  "thirtyDayPlan": ["Initiative 1", "Initiative 2", "Initiative 3"],
  "ninetyDayPlan": ["Strategic goal 1", "Strategic goal 2"],
  "recommendedMosoService": "One of: SEO Sprint, Homepage Rewrite, AEO Content System, Full Site Rebuild, GEO Foundation Package, Launch System",
  "ctaMessage": "One warm sentence inviting the prospect to book a strategy session with MOSO",
  "leadTemperature": "hot|warm|cold",
  "recommendedOffer": "Short offer matching their pain",
  "auditSummaryForCrm": "2-3 sentence plain-text summary for internal MOSO team"
}

Rules:
- quickWins: 3-5 items, low effort / high impact
- biggestBlockers: 2-3 items, highest priority issues
- prioritizedRoadmap: 5-8 items ordered high to low priority
- sevenDayPlan: 3-5 quick, practical actions
- thirtyDayPlan: 3-4 moderate-effort initiatives
- ninetyDayPlan: 2-3 strategic improvements
- Be specific to this site — mention actual headings, domain, detected issues
- Do not guarantee rankings, traffic, AI citations, or placement
- Use warm, premium, practical language appropriate for a business owner
`.trim()
}

function fallbackReport(raw: AuditRawResults): AIReport {
  const temp = classifyLeadTemperature(raw.overallScore)
  const { seo, aeo, geo, ux } = raw.categoryScores

  return {
    executiveSummary: `This site scored ${raw.overallScore}/100 across SEO, AEO, GEO, and UX signals. There are clear opportunities to improve search visibility, answer-engine presence, and generative AI discoverability.`,
    overallScore: raw.overallScore,
    categoryScores: raw.categoryScores,
    categoryLabels: {
      seo: 'SEO Foundation',
      aeo: 'AEO Readiness',
      geo: 'GEO Visibility',
      ux: 'UX & Trust',
    },
    topFindings: [
      `SEO Foundation scored ${seo}/100 — technical and on-page signals need review`,
      `GEO Visibility scored ${geo}/100 — entity markup and AI-readable content gaps detected`,
      `AEO Readiness scored ${aeo}/100 — direct answers and FAQ structure are limited`,
    ],
    seoFindings: [
      'Structured data is missing or incomplete',
      'Meta and heading structure needs review',
      'Performance improvements needed for mobile users',
    ],
    aeoFindings: [
      'FAQ content and direct question-answer sections are missing',
      'Service descriptions lack conversational, answer-ready formatting',
    ],
    geoFindings: [
      'Entity markup (Organization or LocalBusiness schema) is not detected',
      'Brand and service identity signals are weak — AI systems may struggle to summarize this business',
    ],
    uxFindings: [
      'Calls-to-action and trust signals near conversion points need strengthening',
    ],
    quickWins: [
      {
        priority: 'high',
        category: 'GEO',
        issue: 'No Organization or LocalBusiness schema detected',
        recommendation: 'Add Organization and LocalBusiness schema markup to your homepage',
        effort: 'low',
        impact: 'high',
      },
      {
        priority: 'high',
        category: 'AEO',
        issue: 'No FAQ content or FAQ schema found',
        recommendation: 'Add a FAQ section with FAQPage schema to key service pages',
        effort: 'low',
        impact: 'high',
      },
      {
        priority: 'medium',
        category: 'SEO',
        issue: 'Missing or suboptimal meta description',
        recommendation: 'Write a compelling 130–155 character meta description for each key page',
        effort: 'low',
        impact: 'medium',
      },
    ],
    biggestBlockers: [
      {
        priority: 'high',
        category: 'GEO',
        issue: 'Entity and brand clarity is insufficient for AI systems',
        recommendation: 'Add Organization schema, improve About page, add service descriptions',
        effort: 'medium',
        impact: 'high',
      },
    ],
    prioritizedRoadmap: [
      {
        priority: 'high',
        category: 'GEO',
        issue: 'Missing entity schema markup',
        recommendation: 'Implement Organization, LocalBusiness, and Service schema',
        effort: 'low',
        impact: 'high',
      },
      {
        priority: 'high',
        category: 'AEO',
        issue: 'No FAQ or answer-ready content',
        recommendation: 'Add FAQs to service pages and implement FAQPage schema',
        effort: 'medium',
        impact: 'high',
      },
      {
        priority: 'medium',
        category: 'SEO',
        issue: 'Performance improvements needed',
        recommendation: 'Optimize images, reduce render-blocking resources, enable caching',
        effort: 'medium',
        impact: 'high',
      },
    ],
    sevenDayPlan: [
      'Add Organization schema to homepage',
      'Write and add meta descriptions to all key pages',
      'Add one FAQ section to your top service page',
    ],
    thirtyDayPlan: [
      'Build out service pages with clear descriptions and FAQs',
      'Implement full structured data suite (LocalBusiness, Service, BreadcrumbList)',
      'Add testimonials or case studies to service pages',
    ],
    ninetyDayPlan: [
      'Develop a content library with helpful articles and guides',
      'Strengthen brand entity signals across all pages for long-term AI discoverability',
    ],
    recommendedMosoService: ux < 50 ? 'Full Site Rebuild' : seo < 50 ? 'SEO Sprint' : 'GEO Foundation Package',
    ctaMessage:
      'Book a free 30-minute strategy session with MOSO to walk through your audit findings and next steps.',
    leadTemperature: temp,
    recommendedOffer: 'GEO Foundation Package',
    auditSummaryForCrm: `Site scored ${raw.overallScore}/100. SEO: ${seo}, AEO: ${aeo}, GEO: ${geo}, UX: ${ux}. Lead temperature: ${temp}. Recommend outreach focused on entity clarity and structured data improvements.`,
  }
}
