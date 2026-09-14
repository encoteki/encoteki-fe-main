import { WhitelistFlow } from '@/components/whitelist/whitelist-flow'

// The shareable referral link: /whitelist/refcode/ABC123. Renders exactly
// the same flow as /whitelist, except the invite-code field arrives filled
// and locked, so an invited applicant is attributed to whoever sent the
// link without having to type — or notice — anything. The X sign-in gate
// still comes first; the code only appears once they are signed in.
//
// `params` is a Promise in this Next version and must be awaited.
//
// `code` arrives already decoded — Next's router decodes dynamic segments
// before this component runs. src/proxy.ts's guard exists to catch a
// segment that fails to decode at all (which would otherwise crash Next's
// router before this component is ever reached), not to enable a second
// decode here — decoding an already-decoded value can itself throw on a
// code that happens to contain a literal `%` sequence.
export default async function WhitelistRefcodePage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  return <WhitelistFlow lockedReferralCode={code.trim().toUpperCase()} />
}
