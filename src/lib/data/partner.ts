import { createClient } from '@/lib/supabase/server'
import { PartnerSchema } from '@/lib/schemas/partner'
import type { Partners } from '@/types/partner.type'

const MAX_LIMIT = 50

export interface PartnersResponse {
  success: boolean
  data: Partners[]
  hasNextPage?: boolean
  message?: string
}

export async function fetchPartners(
  page: number = 1,
  limit: number = 6,
): Promise<PartnersResponse> {
  try {
    const supabase = await createClient()

    const safePage = Math.max(1, Math.floor(page))
    const safeLimit = Math.min(MAX_LIMIT, Math.max(1, Math.floor(limit)))
    const from = (safePage - 1) * safeLimit
    const to = from + safeLimit

    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('is_active', true)
      .range(from, to)
      .order('id', { ascending: true })

    if (error) throw error

    const hasNextPage = data.length > safeLimit
    const pagedData = data.slice(0, safeLimit)

    const formattedData = pagedData.map((item) => PartnerSchema.parse(item))

    return { success: true, data: formattedData, hasNextPage }
  } catch (error: unknown) {
    console.error('Error [fetchPartners]:', error)
    return { success: false, data: [], message: 'Failed to fetch partners' }
  }
}
