import { createClient } from '@/lib/supabase/client'
import { Partners } from '@/types/partner.type'

export async function getPartners(page: number, limit: number = 6) {
  const supabase = createClient()

  const from = (page - 1) * limit
  const to = from + limit

  const { data, error } = await supabase
    .from('public_partners_view')
    .select('*')
    .range(from, to)
    .order('id', { ascending: true })

  if (error) {
    throw error
  }

  return data as Partners[]
}

export async function getPartnerById(id: number) {
  const supabase = createClient()
  const { data } = await supabase
    .from('public_partners_view')
    .select('*')
    .eq('id', id)
    .single()

  return data as Partners
}
