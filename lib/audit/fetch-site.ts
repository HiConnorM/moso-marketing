import { logger } from '../utils/logger'

export interface FetchResult {
  status: number
  body: string
  contentType: string
  ok: boolean
}

export async function fetchPage(url: string): Promise<FetchResult> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'MOSO-Audit-Bot/1.0 (https://www.moso.marketing; audit@moso.marketing)',
        Accept: 'text/html,application/xhtml+xml',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    })
    return {
      status: res.status,
      body: await res.text(),
      contentType: res.headers.get('content-type') ?? '',
      ok: res.ok,
    }
  } catch (err) {
    logger.error(`Failed to fetch ${url}`, err)
    return { status: 0, body: '', contentType: '', ok: false }
  }
}

export async function fetchRobots(
  origin: string
): Promise<{ found: boolean; status: number; content: string }> {
  const result = await fetchPage(`${origin}/robots.txt`)
  return {
    found: result.ok && result.body.length > 0,
    status: result.status,
    content: result.ok ? result.body.slice(0, 2000) : '',
  }
}

export async function detectSitemap(
  origin: string,
  robotsContent: string
): Promise<{ found: boolean; url: string | null }> {
  // Try to find sitemap in robots.txt first
  const sitemapMatch = robotsContent.match(/^Sitemap:\s*(.+)$/im)
  if (sitemapMatch) {
    return { found: true, url: sitemapMatch[1].trim() }
  }

  // Fall back to common locations
  for (const path of ['/sitemap.xml', '/sitemap_index.xml', '/sitemap/']) {
    const result = await fetchPage(`${origin}${path}`)
    if (result.ok && result.body.length > 50) {
      return { found: true, url: `${origin}${path}` }
    }
  }

  return { found: false, url: null }
}
