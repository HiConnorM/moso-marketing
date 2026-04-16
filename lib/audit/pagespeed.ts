import type { PageSpeedResult } from '../../types/audit'
import { getEnv } from '../utils/env'
import { logger } from '../utils/logger'

const PAGESPEED_BASE = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'

export async function getPageSpeed(
  url: string,
  strategy: 'mobile' | 'desktop'
): Promise<PageSpeedResult> {
  const endpoint = new URL(PAGESPEED_BASE)
  endpoint.searchParams.set('url', url)
  endpoint.searchParams.set('strategy', strategy)
  endpoint.searchParams.set('key', getEnv('GOOGLE_PAGESPEED_API_KEY'))

  const res = await fetch(endpoint.toString(), { cache: 'no-store' })

  if (!res.ok) {
    logger.error(`PageSpeed API failed for ${strategy}`, {
      status: res.status,
      url,
    })
    // Return zeroed result rather than crashing the whole audit
    return zeroedResult()
  }

  const data = await res.json()
  return parsePageSpeedResult(data)
}

function parsePageSpeedResult(data: Record<string, unknown>): PageSpeedResult {
  const categories = (data.lighthouseResult as Record<string, unknown>)
    ?.categories as Record<string, { score: number | null }> | undefined
  const audits = (data.lighthouseResult as Record<string, unknown>)
    ?.audits as Record<string, { numericValue?: number }> | undefined

  const score = (key: string) =>
    categories?.[key]?.score != null
      ? Math.round((categories[key].score ?? 0) * 100)
      : 0

  const metric = (key: string) => audits?.[key]?.numericValue ?? null

  return {
    performance: score('performance'),
    accessibility: score('accessibility'),
    seo: score('seo'),
    bestPractices: score('best-practices'),
    fcp: metric('first-contentful-paint'),
    lcp: metric('largest-contentful-paint'),
    cls: metric('cumulative-layout-shift'),
    tbt: metric('total-blocking-time'),
    si: metric('speed-index'),
  }
}

function zeroedResult(): PageSpeedResult {
  return {
    performance: 0,
    accessibility: 0,
    seo: 0,
    bestPractices: 0,
    fcp: null,
    lcp: null,
    cls: null,
    tbt: null,
    si: null,
  }
}
