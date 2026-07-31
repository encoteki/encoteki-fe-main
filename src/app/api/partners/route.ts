import { fetchPartners } from '@/lib/data/partner'
import { createPaginatedRoute } from '@/lib/api/paginated-route'

// Partner deals change rarely; cache at the edge/CDN so repeated hits don't
// each cost a Supabase query + PostHog event.
export const revalidate = 300

export const GET = createPaginatedRoute({
  routeKey: 'partners',
  fetcher: fetchPartners,
  event: 'partners_api_fetched',
})
