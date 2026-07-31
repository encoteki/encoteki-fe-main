import { NextRequest, NextResponse, after } from 'next/server'
import { getPostHogClient } from '@/lib/posthog-server'
import { PaginationSchema } from '@/lib/schemas/pagination'
import { isRateLimited } from '@/lib/rate-limit'

interface PaginatedResult<T> {
  success: boolean
  data: T[]
  hasNextPage?: boolean
  message?: string
}

// Shared GET handler for public, rarely-changing paginated resources:
// rate-limits by IP, validates page/limit, fires a PostHog fetch event, and
// caches the response at the edge/CDN. Pair with `export const revalidate =
// 300` in the route file so the wrapping page/route also gets ISR.
export function createPaginatedRoute<T>(opts: {
  routeKey: string
  fetcher: (page: number, limit: number) => Promise<PaginatedResult<T>>
  event: string
}) {
  return async function GET(request: NextRequest) {
    if (isRateLimited(request, opts.routeKey)) {
      return NextResponse.json(
        { success: false, data: [], message: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': '60' } },
      )
    }

    const { searchParams } = request.nextUrl
    const { page, limit } = PaginationSchema.parse(
      Object.fromEntries(searchParams),
    )

    const result = await opts.fetcher(page, limit)

    const posthog = getPostHogClient()
    posthog.capture({
      distinctId: 'server',
      event: opts.event,
      properties: {
        page,
        limit,
        count: result.data?.length ?? 0,
        has_next_page: result.hasNextPage ?? false,
        success: result.success,
      },
    })

    // Flush after the response is sent so the event isn't dropped when a
    // serverless function freezes before the capture request completes.
    after(async () => {
      await posthog.flush()
    })

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  }
}
