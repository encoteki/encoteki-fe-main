import { createClient } from '@/lib/supabase/server'
import { PartnerSchema } from '@/lib/schemas/partner'
import type { Partners } from '@/types/partner.type'

export interface PartnersResponse {
  success: boolean
  data: Partners[]
  hasNextPage?: boolean
  message?: string
}

// `page`/`limit` are trusted here — callers are the route handler (already
// validated by PaginationSchema) or page.tsx (hardcoded safe literals).
export async function fetchPartners(
  page: number = 1,
  limit: number = 6,
): Promise<PartnersResponse> {
  try {
    const supabase = createClient()

    const from = (page - 1) * limit
    const to = from + limit

    const { data, error } = await supabase
      .from('partners')
      .select(
        `
        id,
        name,
        offer,
        description,
        tnc,
        image,
        store_url,
        is_offline,
        is_active
      `,
      )
      .eq('is_active', true)
      .range(from, to)
      .order('id', { ascending: true })

    if (error) throw error

    const hasNextPage = data.length > limit
    const pagedData = data.slice(0, limit)

    const formattedData = pagedData.map((item) => PartnerSchema.parse(item))

    return { success: true, data: formattedData, hasNextPage }
  } catch (error: unknown) {
    console.error('Error [fetchPartners]:', error)
    return { success: false, data: [], message: 'Failed to fetch partners' }
  }
}
