import { createClient } from '@supabase/supabase-js'
import { getEnv } from '../utils/env'

// Service-role client for server-side use only.
// Never expose this client or these keys to the browser.
let client: ReturnType<typeof createClient> | null = null

export function getSupabaseAdmin() {
  if (!client) {
    client = createClient(
      getEnv('SUPABASE_URL'),
      getEnv('SUPABASE_SERVICE_ROLE_KEY'),
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    )
  }
  return client
}
