// ─── Shared formatting utilities ─────────────────────────────────────────────

/**
 * Format a dollar amount as a compact string.
 * Returns '' for 0, '$Xk' for thousands, '$X.XM' for millions.
 */
export function fmtMoney(n: number): string {
  if (n === 0) return ''
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`
  return `$${n}`
}

/**
 * Format a min–max price range as a compact string.
 */
export function fmtRange(min: number, max: number): string {
  return max > min ? `${fmtMoney(min)}–${fmtMoney(max)}` : fmtMoney(min)
}

/**
 * Split a full name string into first and last name parts.
 * Accepts null/undefined gracefully.
 */
export function splitName(fullName: string | null | undefined): { first: string; last: string } {
  if (!fullName?.trim()) return { first: '', last: '' }
  const parts = fullName.trim().split(/\s+/)
  return {
    first: parts[0],
    last: parts.length > 1 ? parts.slice(1).join(' ') : '',
  }
}
