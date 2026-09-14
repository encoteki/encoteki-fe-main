import { NextRequest, NextResponse } from 'next/server'
import { handlers } from '@/lib/whitelist/auth'
import { checkRateLimit, clientIp } from '@/lib/whitelist/rate-limit'

export const { GET } = handlers

// Only POST is limited: it covers sign-in initiation and provider
// callbacks (the state-changing side of Auth.js), while GET also serves
// session/CSRF/provider lookups that the client polls routinely — limiting
// those would risk breaking normal session refresh rather than blunting
// abuse.
export async function POST(request: NextRequest): Promise<Response> {
  const rateLimit = checkRateLimit(`auth:${clientIp(request)}`, {
    windowMs: 60_000,
    max: 20,
  })
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
      },
    )
  }
  return handlers.POST(request)
}
