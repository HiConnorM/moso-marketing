import type { AuditRawResults, AIReport } from '../../types/audit'
import { classifyLeadTemperature } from './scoring'
import { getEnv } from '../utils/env'
import { logger } from '../utils/logger'

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

export async function generateAIReport(raw: AuditRawResults): Promise<AIReport> {
  const prompt = buildPrompt(raw)

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
              'You are a senior SEO and AEO strategist at MOSO, a boutique creative agency. ' +
              'You write expert, candid, actionable audit reports. Be specific, not generic. ' +
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
    // Ensure computed fields are consistent
    parsed.overallScore = raw.overallScore
    parsed.categoryScores = raw.categoryScores
    parsed.leadTemperature = classifyLeadTemperature(raw.overallScore)

    return parsed
  } catch (err) {
    logger.error('AI report generation failed', err)
    return fallbackReport(raw)
  }
}

function buildPrompt(raw: AuditRawResults): string {
  const { signals, mobile, desktop, categoryScores, overallScore } = raw

  return `
You are generating a detailed AEO/SEO audit report for a MOSO prospect's website.

WEBSITE: ${signals.url}
AUDIT DATE: ${raw.auditedAt}

--- SCORES ---
Overall Score: ${overallScore}/100
Technical SEO: ${categoryScores.technicalSeo}/100
Performance: ${categoryScores.performance}/100
On-Page SEO: ${categoryScores.onPageSeo}/100
AEO Readiness: ${categoryScores.aeoReadiness}/100
UX & Conversion: ${categoryScores.uxConversion}/100

--- PERFORMANCE ---
Mobile: Performance ${mobile.performance}, Accessibility ${mobile.accessibility}, SEO ${mobile.seo}
Desktop: Performance ${desktop.performance}, Accessibility ${desktop.accessibility}, SEO ${desktop.seo}
Mobile LCP: ${mobile.lcp ? (mobile.lcp / 1000).toFixed(2) + 's' : 'unknown'}
Mobile CLS: ${mobile.cls ?? 'unknown'}
Mobile TBT: ${mobile.tbt ? Math.round(mobile.tbt) + 'ms' : 'unknown'}

--- TECHNICAL SIGNALS ---
HTTPS: ${signals.isHttps ? 'Yes' : 'No'}
Canonical tag: ${signals.canonical ?? 'Missing'}
robots.txt: ${signals.robotsStatus === 200 ? 'Found' : 'Not found or error'}
Sitemap: ${signals.sitemapFound ? signals.sitemapUrl : 'Not found'}
Open Graph tags: ${signals.hasOgTags ? 'Present' : 'Missing'}
Twitter Card: ${signals.hasTwitterCards ? 'Present' : 'Missing'}
Structured data types: ${signals.structuredDataTypes.length > 0 ? signals.structuredDataTypes.join(', ') : 'None detected'}

--- ON-PAGE SIGNALS ---
Title: "${signals.title ?? 'Missing'}" (${signals.titleLength} chars)
Meta description: "${signals.metaDescription ?? 'Missing'}" (${signals.metaDescriptionLength} chars)
H1 tags: ${signals.h1s.length > 0 ? signals.h1s.slice(0, 3).join(' | ') : 'None'}
H2 tags: ${signals.h2s.length} found${signals.h2s.length > 0 ? ' (e.g. "' + signals.h2s.slice(0, 2).join('", "') + '")' : ''}
Word count: ~${signals.wordCount}
Images: ${signals.imageCount} total, ${signals.imagesWithAlt} with alt text, ${signals.imagesWithoutAlt} without
Internal links: ${signals.internalLinksCount}

--- AEO SIGNALS ---
FAQ schema: ${signals.hasFaqSchema ? 'Yes' : 'No'}
Organization schema: ${signals.hasOrganizationSchema ? 'Yes' : 'No'}
LocalBusiness schema: ${signals.hasLocalBusinessSchema ? 'Yes' : 'No'}
Phone number visible: ${signals.hasPhoneNumber ? 'Yes' : 'No'}
Address visible: ${signals.hasAddress ? 'Yes' : 'No'}

--- UX/CONVERSION ---
CTA count: ${signals.ctaCount}

Respond with ONLY a JSON object in this exact shape:
{
  "executiveSummary": "3-4 sentences. Specific to this site. What is working, what is failing, what the biggest opportunity is.",
  "overallScore": ${overallScore},
  "categoryScores": {
    "technicalSeo": ${categoryScores.technicalSeo},
    "performance": ${categoryScores.performance},
    "onPageSeo": ${categoryScores.onPageSeo},
    "aeoReadiness": ${categoryScores.aeoReadiness},
    "uxConversion": ${categoryScores.uxConversion}
  },
  "categoryLabels": {
    "technicalSeo": "Technical SEO",
    "performance": "Performance",
    "onPageSeo": "On-Page SEO",
    "aeoReadiness": "AEO Readiness",
    "uxConversion": "UX & Conversion"
  },
  "topFindings": ["string", "string", "string"],
  "quickWins": [
    {
      "priority": "high|medium|low",
      "category": "category name",
      "issue": "specific issue found",
      "recommendation": "specific actionable fix",
      "effort": "low|medium|high",
      "impact": "low|medium|high"
    }
  ],
  "biggestBlockers": [same shape, 2-3 items],
  "prioritizedRoadmap": [same shape, 5-8 items ordered high to low priority],
  "recommendedMosoService": "One of: SEO Sprint, Homepage Rewrite, AEO Content System, Full Site Rebuild, Launch System",
  "ctaMessage": "One sentence inviting the prospect to book a strategy call with MOSO",
  "leadTemperature": "hot|warm|cold",
  "recommendedOffer": "Short offer description matching their pain (e.g. '30-day SEO Sprint')",
  "auditSummaryForCrm": "2-3 sentence plain-text summary for internal MOSO sales team"
}
`.trim()
}

function fallbackReport(raw: AuditRawResults): AIReport {
  const temp = classifyLeadTemperature(raw.overallScore)
  return {
    executiveSummary: `This site scored ${raw.overallScore}/100 across technical SEO, performance, on-page signals, AEO readiness, and UX. There are clear opportunities to improve search visibility and answer engine presence.`,
    overallScore: raw.overallScore,
    categoryScores: raw.categoryScores,
    categoryLabels: {
      technicalSeo: 'Technical SEO',
      performance: 'Performance',
      onPageSeo: 'On-Page SEO',
      aeoReadiness: 'AEO Readiness',
      uxConversion: 'UX & Conversion',
    },
    topFindings: [
      'Performance improvements needed for mobile users',
      'Structured data missing or incomplete',
      'Meta and heading structure needs review',
    ],
    quickWins: [
      {
        priority: 'high',
        category: 'Technical SEO',
        issue: 'Missing or incomplete structured data',
        recommendation: 'Add Organization and FAQ schema markup',
        effort: 'low',
        impact: 'high',
      },
    ],
    biggestBlockers: [
      {
        priority: 'high',
        category: 'Performance',
        issue: 'Mobile performance score is low',
        recommendation: 'Optimize images, reduce render-blocking resources',
        effort: 'medium',
        impact: 'high',
      },
    ],
    prioritizedRoadmap: [
      {
        priority: 'high',
        category: 'Technical SEO',
        issue: 'Structured data gaps',
        recommendation: 'Implement Organization, FAQ, and Service schema',
        effort: 'low',
        impact: 'high',
      },
    ],
    recommendedMosoService: 'SEO Sprint',
    ctaMessage:
      'Book a free 30-minute strategy call with MOSO to walk through your audit findings.',
    leadTemperature: temp,
    recommendedOffer: 'SEO Sprint',
    auditSummaryForCrm: `Site scored ${raw.overallScore}/100. Lead temperature: ${temp}. Recommend outreach focused on performance and structured data improvements.`,
  }
}
