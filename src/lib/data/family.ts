import { createClient } from '@/lib/supabase/server'
import { FamilySchema } from '@/lib/schemas/family'
import type { Family } from '@/types/family.type'

export interface FamilyResponse {
  success: boolean
  data: Family[]
  hasNextPage?: boolean
  message?: string
}

// `page`/`limit` are trusted here — callers are the route handler (already
// validated by PaginationSchema) or page.tsx (hardcoded safe literals).
export async function fetchFamilies(
  page: number = 1,
  limit: number = 6,
): Promise<FamilyResponse> {
  try {
    const supabase = createClient()

    const from = (page - 1) * limit
    const to = from + limit

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

    const hasNextPage = data.length > limit
    const pagedData = data.slice(0, limit)

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
