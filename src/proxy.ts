import { NextResponse } from 'next/server'

export function proxy() {
  const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
    : '*.supabase.co'

  const csp = [
    "default-src 'self'",
    // 'unsafe-inline' is required because Next.js emits inline bootstrap/RSC
    // scripts. A per-request nonce + 'strict-dynamic' is the stricter option,
    // but Next 16 does not inject the nonce onto its scripts in this project,
    // which blocks all first-party JS. Accepted trade-off: the app has no auth
    // or user-script context, and its only HTML sink is DOMPurify-sanitized.
    "script-src 'self' 'unsafe-inline'",
    // 'unsafe-inline' is also required for Tailwind's injected styles and
    // GSAP's runtime inline `style={...}` mutations. Do not add 'unsafe-eval'.
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: https://${supabaseHostname}`,
    `connect-src 'self' https://${supabaseHostname} wss://${supabaseHostname}`,
    "font-src 'self'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
    "object-src 'none'",
  ].join('; ')

  const response = NextResponse.next()
  response.headers.set('Content-Security-Policy', csp)
  return response
}

export const config = {
  matcher: [
    {
      source: '/((?!_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
