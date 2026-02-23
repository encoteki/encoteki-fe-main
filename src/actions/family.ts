'use server'

import { createClient } from '@/lib/supabase/server'
import { Family } from '@/types/family.type'

const MAX_LIMIT = 50

interface FamilyResponse {
  success: boolean
  data: Family[]
  message?: string
}

export async function getFamilies(
  page: number = 1,
  limit: number = 6,
): Promise<FamilyResponse> {
  try {
    const supabase = await createClient()

    const safePage = Math.max(1, Math.floor(page))
    const safeLimit = Math.min(MAX_LIMIT, Math.max(1, Math.floor(limit)))

    const from = (safePage - 1) * safeLimit
    const to = from + safeLimit - 1

    const { data, error } = await supabase
      .from('family')
      .select(
        `
        id,
        name,
        description,
        image,
        link,
        tags (
          label
        )
      `,
      )
      .order('name', { ascending: true })
      .range(from, to)

    if (error) throw error

    const formattedData = data.map((item: Record<string, unknown>) => ({
      ...item,
      tags: (item.tags as Record<string, string> | null)?.label
        ? (item.tags as Record<string, string>).label
        : '',
    })) as unknown as Family[]

    return { success: true, data: formattedData }
  } catch (error: unknown) {
    console.error('Server Action Error [getFamilies]:', error)
    return { success: false, data: [], message: 'Failed to fetch families' }
  }
}
