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
      .from('partners')
      .select('*')
      .range(from, to)
      .order('id', { ascending: true })

    if (error) throw error

    return NextResponse.json({ success: true, status: 200, data })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 },
    )
  }
}
