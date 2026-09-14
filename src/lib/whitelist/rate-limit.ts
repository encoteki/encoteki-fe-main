export interface RateLimitConfig {
  windowMs: number
  max: number
}

export interface RateLimitResult {
  allowed: boolean
  // Seconds until the caller's window resets — only meaningful when
  // `allowed` is false, for a `Retry-After` header.
  retryAfterSeconds: number
}

interface Bucket {
  count: number
  resetAt: number
}

// Per-process in-memory store. This throttles a single running instance; it
// does not share state across separate serverless invocations, so it raises
// the cost of scripted abuse rather than capping it exactly. A shared store
// (e.g. Upstash Redis) would close that gap but isn't wired up here.
const buckets = new Map<string, Bucket>()

// No server-side attack surface here today (this repo doesn't run the
// source app's vitest suite), but kept as ported — harmless when false, and
// keeps this file a faithful, mechanical copy of the source.
const DISABLED_IN_TEST = process.env.NODE_ENV === 'test'

// Bounds memory growth without a timer (serverless invocations shouldn't
// keep one alive) by sweeping expired entries periodically instead of on
// every call.
let opsSinceSweep = 0
function sweep(now: number) {
  opsSinceSweep += 1
  if (opsSinceSweep < 500) return
  opsSinceSweep = 0
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

/** Fixed-window limiter. `key` should already include the route name, since
 * callers share one process-wide map. */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig,
): RateLimitResult {
  if (DISABLED_IN_TEST) return { allowed: true, retryAfterSeconds: 0 }

  const now = Date.now()
  sweep(now)

  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + config.windowMs })
    return { allowed: true, retryAfterSeconds: 0 }
  }
  if (bucket.count >= config.max) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    }
  }
  bucket.count += 1
  return { allowed: true, retryAfterSeconds: 0 }
}

// x-forwarded-for is a comma-separated chain where each hop APPENDS its own
// address on the right; the leftmost entry is whatever the original client
// claimed and is fully attacker-controlled. The rightmost entry is the one
// our own trusted reverse proxy appended, so it's the one entry that isn't
// spoofable — reading the first entry instead would let an attacker send a
// fresh fake value per request to dodge every limit below, or send a real
// victim's IP to get them falsely throttled.
export function clientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const hops = forwardedFor
      .split(',')
      .map((hop) => hop.trim())
      .filter(Boolean)
    if (hops.length > 0) return hops[hops.length - 1]
  }
  return request.headers.get('x-real-ip') ?? 'unknown'
}
