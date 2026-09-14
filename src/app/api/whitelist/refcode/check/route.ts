import { NextResponse } from 'next/server'
import { auth } from '@/lib/whitelist/auth'
import { supabaseServerClient } from '@/lib/whitelist/supabase'
import { checkRateLimit, clientIp } from '@/lib/whitelist/rate-limit'

interface CheckResponseBody {
  valid: boolean
  reason: 'not_found' | null
}

export async function GET(
  request: Request,
): Promise<NextResponse<CheckResponseBody>> {
  // Ahead of auth: this endpoint is a yes/no oracle over referral codes, so
  // it's the one thing here worth capping against scripted brute-forcing —
  // checked before the session/DB round trips below, not after.
  const rateLimit = checkRateLimit(`refcode-check:${clientIp(request)}`, {
    windowMs: 60_000,
    max: 20,
  })
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { valid: false, reason: null },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
      },
    )
  }

  const session = await auth()
  if (!session?.xUserId) {
    return NextResponse.json({ valid: false, reason: null }, { status: 401 })
  }

  const code = new URL(request.url).searchParams
    .get('code')
    ?.trim()
    .toUpperCase()
  if (!code) {
    return NextResponse.json({ valid: false, reason: null }, { status: 400 })
  }

  const { data, error } = await supabaseServerClient()
    .from('referral_codes')
    .select('code')
    .eq('code', code)
    .maybeSingle()
  if (error) throw error

  if (!data) {
    return NextResponse.json({ valid: false, reason: 'not_found' })
  }
  return NextResponse.json({ valid: true, reason: null })
}
