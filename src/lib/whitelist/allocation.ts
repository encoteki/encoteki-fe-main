import type { SupabaseClient } from '@supabase/supabase-js'

export type Tier = 'fcfs' | 'guaranteed'

export interface AllocationInput {
  xUserId: string
  xUsername: string
  walletAddress: string
  followAttested: boolean
  retweetAttested: boolean
  likeAttested: boolean
  // null means the applicant chose "I don't have a referral code". The
  // function treats null and blank alike, so no normalization is needed here.
  referralCode: string | null
  characterSlug: string | null
}

export interface AllocationResult {
  ok: boolean
  reason:
    | 'duplicate_x_account'
    | 'duplicate_wallet'
    | 'referral_code_invalid'
    | null
  spotNumber: number | null
  referralCode: string | null
  tier: Tier | null
}

export async function allocateSpot(
  supabase: SupabaseClient,
  input: AllocationInput,
): Promise<AllocationResult> {
  const { data, error } = await supabase.rpc('allocate_whitelist_spot', {
    p_x_user_id: input.xUserId,
    p_x_username: input.xUsername,
    p_wallet_address: input.walletAddress,
    p_follow_attested: input.followAttested,
    p_retweet_attested: input.retweetAttested,
    p_like_attested: input.likeAttested,
    p_referral_code: input.referralCode,
    p_character_slug: input.characterSlug,
  })

  if (error) throw error

  const row = data?.[0] as
    | {
        spot_number: number | null
        rejection_reason: string | null
        referral_code: string | null
        tier: string | null
      }
    | undefined
  if (!row) throw new Error('allocate_whitelist_spot returned no rows')

  return {
    ok: row.rejection_reason === null,
    reason: row.rejection_reason as AllocationResult['reason'],
    spotNumber: row.spot_number,
    referralCode: row.referral_code,
    tier: row.tier as Tier | null,
  }
}
