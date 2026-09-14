import { WhitelistFlow } from '@/components/whitelist/whitelist-flow'

// The plain entry point: no referral code supplied, so the gate step starts
// empty and the applicant may type one or skip it. The same flow rendered
// with a locked code lives at /whitelist/refcode/[code].
export default function WhitelistPage() {
  return <WhitelistFlow />
}
