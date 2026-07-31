import { NextRequest } from 'next/server'

// In-memory fixed-window limiter. This runs per server instance — on a
// multi-instance deployment (e.g. multiple Vercel/Lambda invocations) each
// instance tracks its own counters, so the effective global limit is
// `limit * instanceCount`, not a hard ceiling. It still caps the damage a
// single client can do against a single instance, and costs nothing to run.
// For a hard global limit, move this to an edge WAF rule or a shared store
// (Redis/Upstash) in front of the route.
const WINDOW_MS = 60_000
const MAX_REQUESTS_PER_WINDOW = 30

const hits = new Map<string, { count: number; resetAt: number }>()

// Bound memory: sweep expired entries every window so abusive/rotating IPs
// don't accumulate forever.
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of hits) {
    if (entry.resetAt <= now) hits.delete(key)
  }
}, WINDOW_MS).unref?.()

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0].trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}

export function isRateLimited(request: NextRequest, routeKey: string): boolean {
  const key = `${routeKey}:${getClientIp(request)}`
  const now = Date.now()
  const entry = hits.get(key)

  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }

  entry.count += 1
  return entry.count > MAX_REQUESTS_PER_WINDOW
}
