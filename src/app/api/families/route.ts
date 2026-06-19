import { NextRequest, NextResponse } from 'next/server'
import { fetchFamilies } from '@/lib/data/family'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const page = Number(searchParams.get('page') ?? '1')
  const limit = Number(searchParams.get('limit') ?? '6')

  const result = await fetchFamilies(page, limit)
  return NextResponse.json(result)
}
