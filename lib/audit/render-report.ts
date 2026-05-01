import type { AIReport, AuditRawResults, AuditRecommendation } from '../../types/audit'

export function renderHtmlReport(
  raw: AuditRawResults,
  report: AIReport,
  firstName: string | null,
  businessName: string | null
): string {
  const greeting = firstName ? `Hi ${firstName},` : 'Hi there,'
  const company  = businessName ?? raw.signals.url
  const auditDate = new Date(raw.auditedAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })

  // ── Helpers ──────────────────────────────────────────────────────────────
  const scoreColor = (s: number) => s >= 75 ? '#16a34a' : s >= 50 ? '#d97706' : '#dc2626'
  const scoreLabel = (s: number) => s >= 75 ? 'Strong' : s >= 50 ? 'Needs Work' : 'Critical'

  const divider = `<tr><td style="padding:0 40px;"><div style="height:1px;background:#e5e7eb;"></div></td></tr>`

  const sectionHeader = (title: string) => `
    <tr><td style="padding:36px 40px 16px;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#9ca3af;">${title}</p>
    </td></tr>`

  const categoryRow = (label: string, score: number) => `
    <tr><td style="padding:8px 40px 0;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="font-family:Arial,sans-serif;font-size:13px;color:#374151;width:140px;">${label}</td>
        <td style="padding:0 16px;">
          <div style="background:#e5e7eb;border-radius:4px;height:8px;">
            <div style="background:${scoreColor(score)};border-radius:4px;height:8px;width:${score}%;"></div>
          </div>
        </td>
        <td style="text-align:right;white-space:nowrap;">
          <span style="font-family:Arial,sans-serif;font-size:15px;font-weight:700;color:${scoreColor(score)};">${score}</span>
          <span style="font-family:Arial,sans-serif;font-size:11px;color:#9ca3af;">/100</span>
          <span style="margin-left:6px;font-family:Arial,sans-serif;font-size:10px;font-weight:600;color:${scoreColor(score)};text-transform:uppercase;letter-spacing:0.5px;">${scoreLabel(score)}</span>
        </td>
      </tr></table>
    </td></tr>`

  const findingsList = (items: string[]) => items.map((f, i) => `
    <tr><td style="padding:${i === 0 ? '0' : '6px'} 40px 0;">
      <table cellpadding="0" cellspacing="0"><tr>
        <td style="width:20px;vertical-align:top;padding-top:4px;"><div style="width:5px;height:5px;background:#9ca3af;border-radius:50%;"></div></td>
        <td style="font-family:Arial,sans-serif;font-size:13px;color:#374151;line-height:1.6;">${f}</td>
      </tr></table>
    </td></tr>`).join('')

  const planList = (items: string[], prefix?: string) => items.map((item, i) => `
    <tr><td style="padding:${i === 0 ? '0' : '6px'} 40px 0;">
      <table cellpadding="0" cellspacing="0"><tr>
        <td style="width:24px;vertical-align:top;">
          <div style="width:20px;height:20px;background:#f3f4f6;border-radius:50%;text-align:center;line-height:20px;">
            <span style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;color:#6b7280;">${prefix ?? (i + 1)}</span>
          </div>
        </td>
        <td style="padding-left:8px;font-family:Arial,sans-serif;font-size:13px;color:#374151;line-height:1.6;">${item}</td>
      </tr></table>
    </td></tr>`).join('')

  const priorityColor = (p: AuditRecommendation['priority']) =>
    ({ high: '#dc2626', medium: '#d97706', low: '#16a34a' })[p]

  const recommendationCard = (item: AuditRecommendation, i: number) => `
    <tr><td style="padding:${i === 0 ? '0' : '10px'} 40px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-left:4px solid ${priorityColor(item.priority)};border-radius:6px;">
        <tr><td style="padding:14px 16px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td>
              <span style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${priorityColor(item.priority)};">${item.priority} priority</span>
              <span style="margin-left:8px;font-family:Arial,sans-serif;font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">${item.category}</span>
            </td>
            <td style="text-align:right;">
              <span style="font-family:Arial,sans-serif;font-size:10px;color:#9ca3af;">Effort: ${item.effort} &nbsp;·&nbsp; Impact: ${item.impact}</span>
            </td>
          </tr></table>
          <p style="margin:8px 0 4px;font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#111;">${item.issue}</p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#374151;line-height:1.5;">${item.recommendation}</p>
        </td></tr>
      </table>
    </td></tr>`

  const signalRow = (label: string, value: string, ok: boolean) => `
    <tr style="border-bottom:1px solid #f3f4f5;">
      <td style="padding:8px 0;font-family:Arial,sans-serif;font-size:13px;color:#374151;">${label}</td>
      <td style="padding:8px 0;text-align:right;">
        <span style="font-family:Arial,sans-serif;font-size:12px;font-weight:600;color:${ok ? '#16a34a' : '#dc2626'};">${ok ? '✓' : '✗'} ${value}</span>
      </td>
    </tr>`

  const metricPill = (label: string, value: string | number, good: boolean) => `
    <td style="padding:0 8px 8px 0;">
      <div style="background:${good ? '#f0fdf4' : '#fef2f2'};border:1px solid ${good ? '#bbf7d0' : '#fecaca'};border-radius:6px;padding:10px 14px;text-align:center;min-width:80px;">
        <p style="margin:0 0 2px;font-family:Arial,sans-serif;font-size:18px;font-weight:700;color:${good ? '#16a34a' : '#dc2626'};">${value}</p>
        <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">${label}</p>
      </div>
    </td>`

  // ── Sections ──────────────────────────────────────────────────────────────

  const scoreBreakdown = `
    ${sectionHeader('Visibility Score Breakdown')}
    <tr><td style="padding:0 40px 8px;">
      <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:13px;color:#9ca3af;line-height:1.5;">
        Scored across four dimensions — SEO Foundation (35%), AEO Readiness (25%), GEO Visibility (25%), UX &amp; Trust (15%).
      </p>
    </td></tr>
    ${categoryRow('SEO Foundation', report.categoryScores.seo)}
    ${categoryRow('AEO Readiness', report.categoryScores.aeo)}
    ${categoryRow('GEO Visibility', report.categoryScores.geo)}
    ${categoryRow('UX &amp; Trust', report.categoryScores.ux)}
    <tr><td style="padding:12px 0 0;"></td></tr>`

  const performanceSection = `
    ${divider}
    ${sectionHeader('Performance & Core Web Vitals')}
    <tr><td style="padding:0 40px;">
      <table cellpadding="0" cellspacing="0"><tr>
        <td style="padding-right:24px;vertical-align:top;">
          <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;">Mobile</p>
          <table cellpadding="0" cellspacing="0"><tr>
            ${metricPill('Perf', raw.mobile.performance, raw.mobile.performance >= 70)}
            ${metricPill('SEO', raw.mobile.seo, raw.mobile.seo >= 70)}
            ${metricPill('Access.', raw.mobile.accessibility, raw.mobile.accessibility >= 70)}
          </tr></table>
          ${raw.mobile.lcp ? `<p style="margin:8px 0 0;font-family:Arial,sans-serif;font-size:11px;color:#9ca3af;">LCP: ${(raw.mobile.lcp / 1000).toFixed(1)}s &nbsp;·&nbsp; CLS: ${raw.mobile.cls?.toFixed(3) ?? '—'} &nbsp;·&nbsp; TBT: ${raw.mobile.tbt ? Math.round(raw.mobile.tbt) + 'ms' : '—'}</p>` : ''}
        </td>
        <td style="vertical-align:top;">
          <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;">Desktop</p>
          <table cellpadding="0" cellspacing="0"><tr>
            ${metricPill('Perf', raw.desktop.performance, raw.desktop.performance >= 80)}
            ${metricPill('SEO', raw.desktop.seo, raw.desktop.seo >= 80)}
            ${metricPill('Access.', raw.desktop.accessibility, raw.desktop.accessibility >= 80)}
          </tr></table>
        </td>
      </tr></table>
    </td></tr>`

  const technicalSection = `
    ${divider}
    ${sectionHeader('Technical & SEO Signals')}
    <tr><td style="padding:0 40px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${signalRow('HTTPS', raw.signals.isHttps ? 'Secure' : 'Not Secure', raw.signals.isHttps)}
        ${signalRow('Meta Title', raw.signals.title ? `${raw.signals.titleLength} chars` : 'Missing', !!raw.signals.title && raw.signals.titleLength >= 30 && raw.signals.titleLength <= 60)}
        ${signalRow('Meta Description', raw.signals.metaDescription ? `${raw.signals.metaDescriptionLength} chars` : 'Missing', !!raw.signals.metaDescription && raw.signals.metaDescriptionLength >= 120)}
        ${signalRow('H1 Tag', raw.signals.h1s.length === 1 ? `"${raw.signals.h1s[0]?.substring(0, 45)}…"` : raw.signals.h1s.length === 0 ? 'Missing' : `${raw.signals.h1s.length} found (should be 1)`, raw.signals.h1s.length === 1)}
        ${signalRow('Canonical Tag', raw.signals.canonical ? 'Present' : 'Missing', !!raw.signals.canonical)}
        ${signalRow('robots.txt', raw.signals.robotsStatus === 200 ? 'Found' : 'Not found', raw.signals.robotsStatus === 200)}
        ${signalRow('Sitemap', raw.signals.sitemapFound ? raw.signals.sitemapUrl ?? 'Found' : 'Not found', raw.signals.sitemapFound)}
        ${signalRow('Open Graph Tags', raw.signals.hasOgTags ? 'Present' : 'Missing', raw.signals.hasOgTags)}
        ${signalRow('Internal Links', `${raw.signals.internalLinksCount} found`, raw.signals.internalLinksCount >= 5)}
        ${signalRow('Image Alt Text', raw.signals.imageCount > 0 ? `${raw.signals.imagesWithAlt}/${raw.signals.imageCount} tagged` : 'No images', raw.signals.imageCount === 0 || raw.signals.imagesWithoutAlt === 0)}
        ${signalRow('Word Count', `~${raw.signals.wordCount} words`, raw.signals.wordCount >= 400)}
      </table>
    </td></tr>`

  const aeoSection = `
    ${divider}
    ${sectionHeader('AEO — Answer Engine Readiness')}
    <tr><td style="padding:0 40px 8px;">
      <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:13px;color:#6b7280;line-height:1.5;">How clearly your content answers real questions for answer-style search experiences and AI-assisted results.</p>
    </td></tr>
    <tr><td style="padding:0 40px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${signalRow('FAQ Schema', raw.signals.hasFaqSchema ? 'Present' : 'Missing', raw.signals.hasFaqSchema)}
        ${signalRow('Definitions / "What is" content', raw.signals.hasDefinitions ? 'Detected' : 'Not found', raw.signals.hasDefinitions)}
        ${signalRow('Process / How-it-works content', raw.signals.hasProcessContent ? 'Detected' : 'Not found', raw.signals.hasProcessContent)}
        ${signalRow('H2 Sections', `${raw.signals.h2s.length} found`, raw.signals.h2s.length >= 3)}
        ${signalRow('H3 Sections', `${raw.signals.h3Count} found`, raw.signals.h3Count >= 2)}
        ${signalRow('Service Schema', raw.signals.hasServiceSchema ? 'Present' : 'Missing', raw.signals.hasServiceSchema)}
        ${signalRow('Phone / Address Visible', (raw.signals.hasPhoneNumber || raw.signals.hasAddress) ? 'Yes' : 'No', raw.signals.hasPhoneNumber || raw.signals.hasAddress)}
      </table>
    </td></tr>
    ${report.aeoFindings.length > 0 ? `
    <tr><td style="padding:16px 40px 0;">
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;">AEO Findings</p>
    </td></tr>
    ${findingsList(report.aeoFindings)}` : ''}`

  const geoSection = `
    ${divider}
    ${sectionHeader('GEO — Generative Engine Visibility')}
    <tr><td style="padding:0 40px 8px;">
      <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:13px;color:#6b7280;line-height:1.5;">How well generative AI systems can understand, summarize, and recommend your brand based on entity clarity, structured data, trust signals, and content depth.</p>
    </td></tr>
    <tr><td style="padding:0 40px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${signalRow('Organization Schema', raw.signals.hasOrganizationSchema ? 'Present' : 'Missing', raw.signals.hasOrganizationSchema)}
        ${signalRow('LocalBusiness Schema', raw.signals.hasLocalBusinessSchema ? 'Present' : 'Missing', raw.signals.hasLocalBusinessSchema)}
        ${signalRow('WebSite Schema', raw.signals.hasWebSiteSchema ? 'Present' : 'Missing', raw.signals.hasWebSiteSchema)}
        ${signalRow('Structured Data Types', raw.signals.structuredDataTypes.length > 0 ? raw.signals.structuredDataTypes.join(', ') : 'None detected', raw.signals.hasStructuredData)}
        ${signalRow('About Page', raw.signals.hasAboutPage ? 'Linked' : 'Not detected', raw.signals.hasAboutPage)}
        ${signalRow('Service Pages', raw.signals.hasServicePages ? 'Linked' : 'Not detected', raw.signals.hasServicePages)}
        ${signalRow('Testimonials', raw.signals.hasTestimonials ? 'Detected' : 'Not found', raw.signals.hasTestimonials)}
        ${signalRow('Case Studies', raw.signals.hasCaseStudies ? 'Detected' : 'Not found', raw.signals.hasCaseStudies)}
        ${signalRow('Credentials / Awards', raw.signals.hasCredentials ? 'Detected' : 'Not found', raw.signals.hasCredentials)}
        ${signalRow('Founder / Team Info', raw.signals.hasFounderInfo ? 'Detected' : 'Not found', raw.signals.hasFounderInfo)}
        ${signalRow('External Profiles', raw.signals.hasExternalProfiles ? 'Detected' : 'Not found', raw.signals.hasExternalProfiles)}
        ${signalRow('NAP Consistency', raw.signals.hasNapData ? 'Name + Address + Phone present' : 'Incomplete', raw.signals.hasNapData)}
      </table>
    </td></tr>
    ${report.geoFindings.length > 0 ? `
    <tr><td style="padding:16px 40px 0;">
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;">GEO Findings</p>
    </td></tr>
    ${findingsList(report.geoFindings)}` : ''}`

  const sevenDaySection = report.sevenDayPlan?.length ? `
    ${sectionHeader('7-Day Quick Wins')}
    <tr><td style="padding:0 40px 4px;">
      <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:13px;color:#6b7280;">Start here. These are low-effort, high-impact actions you can complete this week.</p>
    </td></tr>
    ${planList(report.sevenDayPlan)}` : ''

  const thirtyDaySection = report.thirtyDayPlan?.length ? `
    ${divider}
    ${sectionHeader('30-Day Optimization Plan')}
    ${planList(report.thirtyDayPlan)}` : ''

  const ninetyDaySection = report.ninetyDayPlan?.length ? `
    ${divider}
    ${sectionHeader('90-Day Growth Plan')}
    ${planList(report.ninetyDayPlan)}` : ''

  // ── Final template ────────────────────────────────────────────────────────
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your MOSO SEO + AEO + GEO Audit — ${company}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f5;-webkit-font-smoothing:antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f5;padding:32px 16px;">
<tr><td align="center">
<table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

  <!-- HEADER -->
  <tr><td style="background:#000000;padding:32px 40px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td>
      <img src="https://www.moso.marketing/images/OSO.svg" alt="MOSO" height="28" style="display:block;margin-bottom:20px;" />
      <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Your SEO + AEO + GEO Audit</p>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#6b7280;">${company} &nbsp;·&nbsp; ${auditDate}</p>
    </td></tr></table>
  </td></tr>

  <!-- GREETING -->
  <tr><td style="padding:32px 40px 0;">
    <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:15px;color:#111;">${greeting}</p>
    <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;color:#374151;line-height:1.7;">${report.executiveSummary}</p>
  </td></tr>

  <!-- OVERALL SCORE -->
  <tr><td style="padding:28px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;"><tr><td style="padding:24px;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td>
          <p style="margin:0 0 2px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#9ca3af;">Overall Visibility Score</p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:48px;font-weight:700;color:${scoreColor(report.overallScore)};line-height:1;">${report.overallScore}<span style="font-size:20px;color:#9ca3af;">/100</span></p>
          <p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:12px;color:${scoreColor(report.overallScore)};font-weight:600;text-transform:uppercase;letter-spacing:1px;">${scoreLabel(report.overallScore)}</p>
        </td>
        <td style="text-align:right;vertical-align:middle;">
          <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#9ca3af;max-width:160px;text-align:right;line-height:1.5;">Scores reflect readiness signals — not a guarantee of rankings or placement.</p>
        </td>
      </tr></table>
    </td></tr></table>
  </td></tr>

  <!-- SCORE BREAKDOWN -->
  ${scoreBreakdown}

  <!-- TOP FINDINGS -->
  ${report.topFindings.length > 0 ? `${divider}${sectionHeader('Key Findings')}${findingsList(report.topFindings)}` : ''}

  <!-- QUICK WINS -->
  ${report.quickWins.length > 0 ? `
  ${divider}
  ${sectionHeader('Quick Wins')}
  <tr><td style="padding:0 40px 4px;">
    <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:13px;color:#6b7280;">High-impact improvements with minimal effort.</p>
  </td></tr>
  ${report.quickWins.map((w, i) => recommendationCard(w, i)).join('')}
  <tr><td style="padding:8px 0 0;"></td></tr>` : ''}

  <!-- BIGGEST BLOCKERS -->
  ${report.biggestBlockers.length > 0 ? `
  ${divider}
  ${sectionHeader('Biggest Visibility Blockers')}
  <tr><td style="padding:0 40px 4px;">
    <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:13px;color:#6b7280;">These are the signals most limiting your search and AI discoverability right now.</p>
  </td></tr>
  ${report.biggestBlockers.map((b, i) => recommendationCard(b, i)).join('')}
  <tr><td style="padding:8px 0 0;"></td></tr>` : ''}

  <!-- PERFORMANCE -->
  ${performanceSection}

  <!-- TECHNICAL SEO -->
  ${technicalSection}

  <!-- AEO SECTION -->
  ${aeoSection}

  <!-- GEO SECTION -->
  ${geoSection}

  <!-- ROADMAP -->
  ${report.prioritizedRoadmap.length > 0 ? `
  ${divider}
  ${sectionHeader('Full Prioritized Roadmap')}
  <tr><td style="padding:0 40px 4px;">
    <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:13px;color:#6b7280;">Your complete action plan, ranked by priority.</p>
  </td></tr>
  ${report.prioritizedRoadmap.map((item, i) => recommendationCard(item, i)).join('')}
  <tr><td style="padding:8px 0 0;"></td></tr>` : ''}

  <!-- TIME-BASED PLANS -->
  ${divider}
  ${sevenDaySection}
  ${thirtyDaySection}
  ${ninetyDaySection}

  <!-- CTA -->
  ${divider}
  <tr><td style="padding:36px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#000;border-radius:10px;"><tr><td style="padding:28px 32px;">
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:18px;font-weight:700;color:#fff;">Ready to take action on your audit?</p>
      <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:14px;color:#9ca3af;line-height:1.6;">${report.ctaMessage}</p>
      <a href="https://www.moso.marketing/contact" style="display:inline-block;background:#fff;color:#000;text-decoration:none;padding:12px 28px;border-radius:6px;font-family:Arial,sans-serif;font-size:14px;font-weight:700;">Book a Strategy Session</a>
    </td></tr></table>
  </td></tr>

  <!-- DISCLAIMER -->
  <tr><td style="padding:0 40px 32px;">
    <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#9ca3af;line-height:1.6;border-top:1px solid #e5e7eb;padding-top:20px;">This audit is an automated strategic review based on publicly available website signals. Scores are directional and intended to identify opportunities, not guarantee rankings, traffic, AI citations, or search placement. MOSO — moso.marketing</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}
