import { NextResponse } from 'next/server'
import { auth } from '@/lib/whitelist/auth'
import { supabaseServerClient } from '@/lib/whitelist/supabase'
import { getCampaignConfig } from '@/lib/whitelist/campaign-config'
import { checkRateLimit, clientIp } from '@/lib/whitelist/rate-limit'

interface StatusResponseBody {
  campaignName: string
  targetAccountUsername: string
  targetPostId: string
  guaranteedThreshold: number
  existingEntry: {
    spotNumber: number
    xUsername: string
    tier: 'fcfs' | 'guaranteed'
    referralCode: string
    referralUsesCount: number
    characterSlug: string | null
  } | null
}

export async function GET(
  request: Request,
): Promise<NextResponse<StatusResponseBody>> {
  const campaignConfig = getCampaignConfig()

  // Unauthenticated calls do no DB work at all below (existingEntry stays
  // null without a session), so this is mainly guarding the per-session DB
  // reads a signed-in caller can trigger by scripting this endpoint.
  const rateLimit = checkRateLimit(`status:${clientIp(request)}`, {
    windowMs: 60_000,
    max: 30,
  })
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        campaignName: campaignConfig.campaignName,
        targetAccountUsername: campaignConfig.targetAccountUsername,
        targetPostId: campaignConfig.targetPostId,
        guaranteedThreshold: campaignConfig.guaranteedThreshold,
        existingEntry: null,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
      },
    )
  }

  const session = await auth()
  let existingEntry: StatusResponseBody['existingEntry'] = null

  if (session?.xUserId) {
    const { data: entry, error: entryError } = await supabaseServerClient()
      .from('whitelist_entries')
      .select('id, spot_number, x_username, tier, character_slug')
      .eq('x_user_id', session.xUserId)
      .maybeSingle()
    if (entryError) throw entryError

    if (entry) {
      const { data: code, error: codeError } = await supabaseServerClient()
        .from('referral_codes')
        .select('code, uses_count')
        .eq('owner_entry_id', entry.id)
        .single()
      if (codeError) throw codeError

      existingEntry = {
        spotNumber: entry.spot_number,
        xUsername: entry.x_username,
        tier: entry.tier as 'fcfs' | 'guaranteed',
        referralCode: code.code,
        referralUsesCount: code.uses_count,
        characterSlug: entry.character_slug,
      }
    }
  }

  return NextResponse.json({
    campaignName: campaignConfig.campaignName,
    targetAccountUsername: campaignConfig.targetAccountUsername,
    targetPostId: campaignConfig.targetPostId,
    guaranteedThreshold: campaignConfig.guaranteedThreshold,
    existingEntry,
  })
}
