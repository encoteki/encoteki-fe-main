import { createClient } from '@/lib/supabase/client'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 6

    const from = (page - 1) * limit
    const to = from + limit - 1

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

    const formattedData = data.map((item: any) => ({
      ...item,
      tags: item.tags?.label ? item.tags?.label : '',
    }))

    return NextResponse.json({
      success: true,
      status: 200,
      data: formattedData,
    })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 },
    )
  }
}
