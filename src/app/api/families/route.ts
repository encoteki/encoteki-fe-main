import { NextRequest, NextResponse, after } from 'next/server'
import { fetchFamilies } from '@/lib/data/family'
import { getPostHogClient } from '@/lib/posthog-server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const page = Number(searchParams.get('page') ?? '1')
  const limit = Number(searchParams.get('limit') ?? '6')

  const result = await fetchFamilies(page, limit)

  const posthog = getPostHogClient()
  posthog.capture({
    distinctId: 'server',
    event: 'families_api_fetched',
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

  return NextResponse.json(result)
}
