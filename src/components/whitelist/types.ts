export interface StatusResponse {
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

export interface ValidateResponse {
  ok: boolean
  marks: {
    follow: 'yes' | 'no'
    repost: 'yes' | 'no'
    like: 'yes' | 'no'
    wallet: 'yes' | 'no'
  }
  reason:
    | 'duplicate_x_account'
    | 'duplicate_wallet'
    | 'referral_code_invalid'
    | null
  spotNumber: number | null
  referralCode: string | null
  tier: 'fcfs' | 'guaranteed' | null
}

export interface RefcodeCheckResponse {
  valid: boolean
  reason: 'not_found' | null
}
