import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env } from './env'

// Server-only, service-role client for the whitelist feature. Separate from
// src/lib/supabase/server.ts (this repo's existing anon/publishable-key
// client, used by /family and /partners) — that client has no auth context
// and relies entirely on RLS-open reads; this one bypasses RLS via the
// service role key and must never be imported into client-side code.
//
// Built lazily, on first call, rather than at module scope — Next's
// build-time page-data collection imports every route module just to
// inspect its config, and an eager createClient() call here would need
// SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY to exist as env vars during
// `next build` itself, even in environments (CI) that never run the route
// and have no reason to carry those secrets.
let client: SupabaseClient | null = null

export function supabaseServerClient(): SupabaseClient {
  if (!client) {
    client = createClient(env.supabaseUrl(), env.supabaseServiceRoleKey(), {
      auth: { persistSession: false },
    })
  }
  return client
}
