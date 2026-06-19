import { NextRequest, NextResponse } from 'next/server'
import { fetchPartners } from '@/lib/data/partner'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const page = Number(searchParams.get('page') ?? '1')
  const limit = Number(searchParams.get('limit') ?? '6')

  const result = await fetchPartners(page, limit)
  return NextResponse.json(result)
}
