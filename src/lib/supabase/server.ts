import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// This app has no auth/sessions (RLS on the `anon` role is the sole
// authorization layer — see security-audit.md's threat model), so there is
// no session to plumb through cookies. A cookie-aware client here would
// call `cookies()`, which forces every caller into dynamic rendering and
// defeats ISR (`revalidate`) on /family and /partners.
export function createClient() {
  return createSupabaseClient(
    process.env.SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  )
}
