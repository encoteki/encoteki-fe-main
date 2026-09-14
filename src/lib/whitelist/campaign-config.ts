import { env } from './env'

export const CAMPAIGN_CONFIG = {
  // A username, not a numeric ID — the target account is known not to
  // rename, so the extra robustness of an ID-based link isn't needed here.
  targetAccountUsername: env.campaignTargetAccountUsername(),
  targetPostId: env.campaignTargetPostId(),
  campaignName: env.campaignName(),

  // Referrals needed to move from the FCFS tier to Guaranteed.
  //
  // The authoritative copy is `c_threshold` inside allocate_whitelist_spot
  // (encoteki-whitelist-app/supabase/migrations/0008_guaranteed_tier.sql) —
  // that is what actually decides promotions in the database. This copy
  // exists only so the UI renders the same number instead of guessing it.
  // Change one and you must change the other.
  guaranteedThreshold: 3,
}
