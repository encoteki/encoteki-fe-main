import type { StaticImageData } from 'next/image'

import tiggyReferralCard from '@/assets/quiz-cards-referral/tiggy.webp'
import gajaraReferralCard from '@/assets/quiz-cards-referral/gajara.webp'
import owenReferralCard from '@/assets/quiz-cards-referral/owen.webp'
import komesiReferralCard from '@/assets/quiz-cards-referral/komesi.webp'
import cendryReferralCard from '@/assets/quiz-cards-referral/cendry.webp'
import kanghoonReferralCard from '@/assets/quiz-cards-referral/kanghoon.webp'

// The static "with referral code slot" card art, keyed by character slug —
// used only for WhitelistedView's preview thumbnail, which shows the art
// as-is (no code baked in). The actual code-embedded image a claimant
// downloads is generated dynamically by /api/whitelist/card-image/[code];
// rendering that route just to fill a small thumbnail would cost a full
// Satori + sharp render and several MB for no visible benefit at that size.
export const REFERRAL_CARD_IMAGES: Record<string, StaticImageData> = {
  tiggy: tiggyReferralCard,
  gajara: gajaraReferralCard,
  owen: owenReferralCard,
  komesi: komesiReferralCard,
  cendry: cendryReferralCard,
  kanghoon: kanghoonReferralCard,
}
