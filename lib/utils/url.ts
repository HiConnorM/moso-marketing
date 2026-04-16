/**
 * Normalize a URL submitted by a user.
 * Ensures https:// prefix and removes trailing slashes.
 */
export function normalizeUrl(raw: string): string {
  let url = raw.trim()

  // Add protocol if missing
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url
  }

  // Enforce https
  url = url.replace(/^http:\/\//i, 'https://')

  // Remove trailing slash
  url = url.replace(/\/$/, '')

  return url
}

export function getOrigin(url: string): string {
  try {
    return new URL(url).origin
  } catch {
    return url
  }
}

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}
