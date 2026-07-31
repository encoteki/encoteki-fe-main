import { fetchFamilies } from '@/lib/data/family'
import { createPaginatedRoute } from '@/lib/api/paginated-route'

// Family listings change rarely; cache at the edge/CDN so repeated hits
// don't each cost a Supabase query + PostHog event.
export const revalidate = 300

export const GET = createPaginatedRoute({
  routeKey: 'families',
  fetcher: fetchFamilies,
  event: 'families_api_fetched',
})
