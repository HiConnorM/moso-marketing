import type { AIReport, AuditRawResults, AuditRecommendation } from '../../types/audit'

export function renderHtmlReport(
  raw: AuditRawResults,
  report: AIReport,
  leadName: string | null,
  businessName: string | null
): string {
  const greeting = leadName ? `Hi ${leadName},` : 'Hi there,'
  const company = businessName ?? raw.signals.url
  const auditDate = new Date(raw.auditedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const scoreColor = (s: number) => {
    if (s >= 75) return '#16a34a'
    if (s >= 50) return '#d97706'
    return '#dc2626'
  }

  const scoreLabel = (s: number) => {
    if (s >= 75) return 'Strong'
    if (s >= 50) return 'Needs Work'
    return 'Critical'
  }

  const tempColor = {
    hot: '#dc2626',
    warm: '#d97706',
    cold: '#16a34a',
  }[report.leadTemperature]

  const priorityColor = (p: AuditRecommendation['priority']) =>
    ({ high: '#dc2626', medium: '#d97706', low: '#16a34a' })[p]

  // ─── Sub-components ────────────────────────────────────────

  const divider = `<tr><td style="padding:0 40px;"><div style="height:1px;background:#e5e7eb;"></div></td></tr>`

  const sectionHeader = (title: string) => `
    <tr><td style="padding:36px 40px 16px;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#9ca3af;">${title}</p>
    </td></tr>`

  const categoryRow = (label: string, score: number) => `
    <tr>
      <td style="padding:10px 40px 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-family:Arial,sans-serif;font-size:13px;color:#374151;width:160px;">${label}</td>
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
          </tr>
        </table>
      </td>
    </tr>`

  const findingItem = (text: string, index: number) => `
    <tr><td style="padding:${index === 0 ? '0' : '8px'} 40px 0;">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="width:20px;vertical-align:top;padding-top:2px;">
            <div style="width:6px;height:6px;background:#000;border-radius:50%;margin-top:5px;"></div>
          </td>
          <td style="font-family:Arial,sans-serif;font-size:14px;color:#374151;line-height:1.6;">${text}</td>
        </tr>
      </table>
    </td></tr>`

  const recommendationCard = (item: AuditRecommendation, index: number) => `
    <tr><td style="padding:${index === 0 ? '0' : '10px'} 40px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-left:4px solid ${priorityColor(item.priority)};border-radius:6px;">
        <tr>
          <td style="padding:14px 16px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${priorityColor(item.priority)};">${item.priority} priority</span>
                  <span style="margin-left:8px;font-family:Arial,sans-serif;font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">${item.category}</span>
                </td>
                <td style="text-align:right;">
                  <span style="font-family:Arial,sans-serif;font-size:10px;color:#9ca3af;">Effort: ${item.effort} &nbsp;·&nbsp; Impact: ${item.impact}</span>
                </td>
              </tr>
            </table>
            <p style="margin:8px 0 4px;font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#111;">${item.issue}</p>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#374151;line-height:1.5;">${item.recommendation}</p>
          </td>
        </tr>
      </table>
    </td></tr>`

  const metricPill = (label: string, value: string | number, good: boolean) => `
    <td style="padding:0 8px 8px 0;">
      <div style="background:${good ? '#f0fdf4' : '#fef2f2'};border:1px solid ${good ? '#bbf7d0' : '#fecaca'};border-radius:6px;padding:10px 14px;text-align:center;min-width:80px;">
        <p style="margin:0 0 2px;font-family:Arial,sans-serif;font-size:18px;font-weight:700;color:${good ? '#16a34a' : '#dc2626'};">${value}</p>
        <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">${label}</p>
      </div>
    </td>`

  const signalRow = (label: string, value: string, present: boolean) => `
    <tr style="border-bottom:1px solid #f3f4f5;">
      <td style="padding:8px 0;font-family:Arial,sans-serif;font-size:13px;color:#374151;">${label}</td>
      <td style="padding:8px 0;text-align:right;">
        <span style="font-family:Arial,sans-serif;font-size:12px;font-weight:600;color:${present ? '#16a34a' : '#dc2626'};">
          ${present ? '✓' : '✗'} ${value}
        </span>
      </td>
    </tr>`

  // ─── Build sections ────────────────────────────────────────

  const categorySections = `
    ${sectionHeader('Score Breakdown')}
    <tr><td style="padding:0 40px 8px;">
      <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:13px;color:#9ca3af;line-height:1.5;">
        Scored across 5 dimensions — Technical SEO (25%), Performance (20%), On-Page SEO (20%), AEO Readiness (20%), UX &amp; Conversion (15%).
      </p>
    </td></tr>
    ${categoryRow('Technical SEO', report.categoryScores.technicalSeo)}
    ${categoryRow('Performance', report.categoryScores.performance)}
    ${categoryRow('On-Page SEO', report.categoryScores.onPageSeo)}
    ${categoryRow('AEO Readiness', report.categoryScores.aeoReadiness)}
    ${categoryRow('UX &amp; Conversion', report.categoryScores.uxConversion)}
    <tr><td style="padding:16px 0 0;"></td></tr>`

  const performanceSection = `
    ${divider}
    ${sectionHeader('Performance Data')}
    <tr><td style="padding:0 40px;">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-right:24px;vertical-align:top;">
            <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;">Mobile</p>
            <table cellpadding="0" cellspacing="0"><tr>
              ${metricPill('Performance', raw.mobile.performance, raw.mobile.performance >= 70)}
              ${metricPill('SEO', raw.mobile.seo, raw.mobile.seo >= 70)}
              ${metricPill('Accessibility', raw.mobile.accessibility, raw.mobile.accessibility >= 70)}
            </tr></table>
            ${raw.mobile.lcp ? `<p style="margin:8px 0 0;font-family:Arial,sans-serif;font-size:11px;color:#9ca3af;">LCP: ${(raw.mobile.lcp / 1000).toFixed(1)}s &nbsp;·&nbsp; CLS: ${raw.mobile.cls?.toFixed(3) ?? '—'} &nbsp;·&nbsp; TBT: ${raw.mobile.tbt ? Math.round(raw.mobile.tbt) + 'ms' : '—'}</p>` : ''}
          </td>
          <td style="vertical-align:top;">
            <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;">Desktop</p>
            <table cellpadding="0" cellspacing="0"><tr>
              ${metricPill('Performance', raw.desktop.performance, raw.desktop.performance >= 80)}
              ${metricPill('SEO', raw.desktop.seo, raw.desktop.seo >= 80)}
              ${metricPill('Accessibility', raw.desktop.accessibility, raw.desktop.accessibility >= 80)}
            </tr></table>
          </td>
        </tr>
      </table>
    </td></tr>`

  const signalsSection = `
    ${divider}
    ${sectionHeader('Technical Signals')}
    <tr><td style="padding:0 40px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${signalRow('HTTPS', raw.signals.isHttps ? 'Secure' : 'Not Secure', raw.signals.isHttps)}
        ${signalRow('Meta Title', raw.signals.title ? `${raw.signals.titleLength} chars` : 'Missing', !!raw.signals.title && raw.signals.titleLength >= 30 && raw.signals.titleLength <= 60)}
        ${signalRow('Meta Description', raw.signals.metaDescription ? `${raw.signals.metaDescriptionLength} chars` : 'Missing', !!raw.signals.metaDescription && raw.signals.metaDescriptionLength >= 120 && raw.signals.metaDescriptionLength <= 160)}
        ${signalRow('H1 Tag', raw.signals.h1s.length === 1 ? `Found: "${raw.signals.h1s[0]?.substring(0, 50)}${raw.signals.h1s[0]?.length > 50 ? '…' : ''}"` : raw.signals.h1s.length === 0 ? 'Missing' : `${raw.signals.h1s.length} found (should be 1)`, raw.signals.h1s.length === 1)}
        ${signalRow('Canonical Tag', raw.signals.canonical ? 'Present' : 'Missing', !!raw.signals.canonical)}
        ${signalRow('robots.txt', raw.signals.robotsStatus === 200 ? 'Found' : 'Not found', raw.signals.robotsStatus === 200)}
        ${signalRow('Sitemap', raw.signals.sitemapFound ? raw.signals.sitemapUrl ?? 'Found' : 'Not found', raw.signals.sitemapFound)}
        ${signalRow('Open Graph Tags', raw.signals.hasOgTags ? 'Present' : 'Missing', raw.signals.hasOgTags)}
        ${signalRow('Structured Data', raw.signals.hasStructuredData ? raw.signals.structuredDataTypes.join(', ') : 'None detected', raw.signals.hasStructuredData)}
        ${signalRow('FAQ Schema', raw.signals.hasFaqSchema ? 'Present' : 'Missing', raw.signals.hasFaqSchema)}
        ${signalRow('Internal Links', `${raw.signals.internalLinksCount} found`, raw.signals.internalLinksCount >= 5)}
        ${signalRow('Image Alt Text', raw.signals.imageCount > 0 ? `${raw.signals.imagesWithAlt}/${raw.signals.imageCount} images tagged` : 'No images', raw.signals.imageCount === 0 || raw.signals.imagesWithoutAlt === 0)}
        ${signalRow('Estimated Word Count', `~${raw.signals.wordCount} words`, raw.signals.wordCount >= 300)}
        ${signalRow('CTA Count', `${raw.signals.ctaCount} found`, raw.signals.ctaCount >= 2)}
        ${signalRow('Phone Number', raw.signals.hasPhoneNumber ? 'Visible' : 'Not detected', raw.signals.hasPhoneNumber)}
      </table>
    </td></tr>`

  const quickWinsSection = report.quickWins.length > 0 ? `
    ${divider}
    ${sectionHeader('Quick Wins')}
    <tr><td style="padding:0 40px 4px;">
      <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:13px;color:#6b7280;">High-impact improvements you can make right now with minimal effort.</p>
    </td></tr>
    ${report.quickWins.map((w, i) => recommendationCard(w, i)).join('')}
    <tr><td style="padding:8px 0 0;"></td></tr>` : ''

  const blockersSection = report.biggestBlockers.length > 0 ? `
    ${divider}
    ${sectionHeader('Biggest Blockers')}
    <tr><td style="padding:0 40px 4px;">
      <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:13px;color:#6b7280;">These issues are holding your site back the most. Address them first.</p>
    </td></tr>
    ${report.biggestBlockers.map((b, i) => recommendationCard(b, i)).join('')}
    <tr><td style="padding:8px 0 0;"></td></tr>` : ''

  const roadmapSection = report.prioritizedRoadmap.length > 0 ? `
    ${divider}
    ${sectionHeader('Full Prioritized Roadmap')}
    <tr><td style="padding:0 40px 4px;">
      <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:13px;color:#6b7280;">Your complete action plan, ranked by priority. Work through these in order for maximum impact.</p>
    </td></tr>
    ${report.prioritizedRoadmap.map((item, i) => recommendationCard(item, i)).join('')}
    <tr><td style="padding:8px 0 0;"></td></tr>` : ''

  const topFindingsSection = report.topFindings.length > 0 ? `
    ${divider}
    ${sectionHeader('Key Findings')}
    ${report.topFindings.map((f, i) => findingItem(f, i)).join('')}` : ''

  // ─── Final template ────────────────────────────────────────

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your MOSO AEO + SEO Audit — ${company}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f5;-webkit-font-smoothing:antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f5;padding:32px 16px;">
  <tr><td align="center">
  <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- ═══ HEADER ═══ -->
    <tr>
      <td style="background:#000000;padding:32px 40px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <img src="https://www.moso.marketing/images/OSO.svg" alt="MOSO" height="28" style="display:block;margin-bottom:20px;" />
              <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Your Free AEO + SEO Audit</p>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#6b7280;">${company} &nbsp;·&nbsp; ${auditDate}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ═══ OVERALL SCORE ═══ -->
    <tr>
      <td style="background:#000000;padding:0 40px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;">
          <tr>
            <td style="padding:24px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <p style="margin:0 0 2px;font-family:Arial,sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#6b7280;">Overall Score</p>
                    <p style="margin:0;line-height:1;">
                      <span style="font-family:Arial,sans-serif;font-size:64px;font-weight:800;color:${scoreColor(report.overallScore)};">${report.overallScore}</span>
                      <span style="font-family:Arial,sans-serif;font-size:20px;color:#4b5563;">/100</span>
                    </p>
                    <p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#9ca3af;">${scoreLabel(report.overallScore)} — ${report.recommendedOffer}</p>
                  </td>
                  <td style="vertical-align:middle;text-align:right;padding-left:24px;">
                    <div style="background:${tempColor};border-radius:6px;padding:8px 16px;display:inline-block;">
                      <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#fff;">Lead Temp</p>
                      <p style="margin:2px 0 0;font-family:Arial,sans-serif;font-size:18px;font-weight:800;color:#fff;text-transform:capitalize;">${report.leadTemperature}</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ═══ GREETING + SUMMARY ═══ -->
    <tr>
      <td style="padding:32px 40px 0;">
        <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:15px;color:#111;">${greeting}</p>
        <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;color:#374151;line-height:1.7;">${report.executiveSummary}</p>
      </td>
    </tr>

    <!-- ═══ SCORES ═══ -->
    ${categorySections}

    <!-- ═══ PERFORMANCE DATA ═══ -->
    ${performanceSection}

    <!-- ═══ TOP FINDINGS ═══ -->
    ${topFindingsSection}

    <!-- ═══ QUICK WINS ═══ -->
    ${quickWinsSection}

    <!-- ═══ BIGGEST BLOCKERS ═══ -->
    ${blockersSection}

    <!-- ═══ FULL ROADMAP ═══ -->
    ${roadmapSection}

    <!-- ═══ TECHNICAL SIGNALS ═══ -->
    ${signalsSection}

    <!-- ═══ RECOMMENDED SERVICE ═══ -->
    ${divider}
    ${sectionHeader('What MOSO Would Do')}
    <tr><td style="padding:0 40px 28px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">
        <tr>
          <td style="padding:20px 24px;">
            <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#111;">Recommended: ${report.recommendedMosoService}</p>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#374151;line-height:1.6;">${report.ctaMessage}</p>
          </td>
        </tr>
      </table>
    </td></tr>

    <!-- ═══ CTA ═══ -->
    <tr>
      <td style="background:#000000;padding:32px 40px;">
        <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:18px;font-weight:700;color:#fff;">Ready to fix this?</p>
        <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:14px;color:#9ca3af;line-height:1.6;">Book a free 30-minute strategy call. We will walk through your audit together and show you exactly what we would prioritize.</p>
        <a href="https://www.moso.marketing/contact" style="display:inline-block;background:#ffffff;color:#000000;padding:13px 28px;border-radius:6px;font-family:Arial,sans-serif;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:-0.2px;">Book a Strategy Call →</a>
      </td>
    </tr>

    <!-- ═══ FOOTER ═══ -->
    <tr>
      <td style="padding:20px 40px;border-top:1px solid #f3f4f5;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#9ca3af;line-height:1.6;">
                This audit was prepared by <strong style="color:#6b7280;">MOSO</strong> — Creative Studio &nbsp;·&nbsp;
                <a href="https://www.moso.marketing" style="color:#9ca3af;text-decoration:none;">www.moso.marketing</a>
              </p>
              <p style="margin:6px 0 0;font-family:Arial,sans-serif;font-size:11px;color:#d1d5db;">
                You received this because you requested a free audit at moso.marketing/free-audit.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`
}
