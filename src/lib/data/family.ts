import { createClient } from '@/lib/supabase/server'
import { FamilySchema } from '@/lib/schemas/family'
import type { Family } from '@/types/family.type'

const MAX_LIMIT = 50

export interface FamilyResponse {
  success: boolean
  data: Family[]
  hasNextPage?: boolean
  message?: string
}

export async function fetchFamilies(
  page: number = 1,
  limit: number = 6,
): Promise<FamilyResponse> {
  try {
    const supabase = await createClient()

    const safePage = Math.max(1, Math.floor(page))
    const safeLimit = Math.min(MAX_LIMIT, Math.max(1, Math.floor(limit)))
    const from = (safePage - 1) * safeLimit
    const to = from + safeLimit

    const { data, error } = await supabase
      .from('family')
      .select(
        `
        id,
        name,
        description,
        image,
        link,
        is_active,
        tags (
          label
        )
      `,
      )
      .eq('is_active', true)
      .order('name', { ascending: true })
      .range(from, to)

    if (error) throw error

    const hasNextPage = data.length > safeLimit
    const pagedData = data.slice(0, safeLimit)

    const formattedData = pagedData.map((item) =>
      FamilySchema.parse({
        ...item,
        tags: (item.tags as unknown as { label: string } | null)?.label ?? '',
      }),
    )

    return { success: true, data: formattedData, hasNextPage }
  } catch (error: unknown) {
    console.error('Error [fetchFamilies]:', error)
    return { success: false, data: [], message: 'Failed to fetch families' }
  }
}
