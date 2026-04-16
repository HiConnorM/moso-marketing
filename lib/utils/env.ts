/**
 * Validate required environment variables at startup.
 * Call this once from server-side code to catch misconfigurations early.
 */

const required = [
  'OPENAI_API_KEY',
  'GOOGLE_PAGESPEED_API_KEY',
  'RESEND_API_KEY',
  'AUDIT_FROM_EMAIL',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'AIRTABLE_API_KEY',
  'AIRTABLE_BASE_ID',
  'INTERNAL_JOB_KEY',
] as const

export function validateEnv() {
  const missing = required.filter((key) => !process.env[key])
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    )
  }
}

export function getEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`)
  }
  return value
}
