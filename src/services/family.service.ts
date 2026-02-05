import { createClient } from '@/lib/supabase/client'

export const getFamilies = async (page: number, limit: number) => {
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
      tags (
        label
      )
    `,
    )
    .order('name', { ascending: true })
    .range(from, to)

  if (error) {
    console.error('Error fetching families:', error)
    return []
  }

  const formattedData = data.map((item: any) => ({
    ...item,
    tags: item.tags?.label ? item.tags?.label : '',
  }))

  return formattedData
}
