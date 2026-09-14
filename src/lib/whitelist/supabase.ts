import { createClient } from '@supabase/supabase-js'
import { env } from './env'

// Server-only, service-role client for the whitelist feature. Separate from
// src/lib/supabase/server.ts (this repo's existing anon/publishable-key
// client, used by /family and /partners) — that client has no auth context
// and relies entirely on RLS-open reads; this one bypasses RLS via the
// service role key and must never be imported into client-side code.
export const supabaseServerClient = createClient(
  env.supabaseUrl(),
  env.supabaseServiceRoleKey(),
  { auth: { persistSession: false } },
)
