'use server'

import { createClient } from '@/lib/supabase/server'
import { Partners } from '@/types/partner.type'

const MAX_LIMIT = 50

interface PartnersResponse {
  success: boolean
  data: Partners[]
  message?: string
}

export async function getPartners(
  page: number = 1,
  limit: number = 6,
): Promise<PartnersResponse> {
  try {
    const supabase = await createClient()

    const safePage = Math.max(1, Math.floor(page))
    const safeLimit = Math.min(MAX_LIMIT, Math.max(1, Math.floor(limit)))

    const from = (safePage - 1) * safeLimit
    const to = from + safeLimit - 1

    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .range(from, to)
      .order('id', { ascending: true })

    if (error) throw error

    return { success: true, data: data as Partners[] }
  } catch (error: unknown) {
    console.error('Server Action Error [getPartners]:', error)
    return { success: false, data: [], message: 'Failed to fetch partners' }
  }
}
