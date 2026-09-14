import { NextResponse } from 'next/server'
import { auth } from '@/lib/whitelist/auth'
import { supabaseServerClient } from '@/lib/whitelist/supabase'
import { isValidEvmAddress, toChecksumAddress } from '@/lib/whitelist/wallet'
import { allocateSpot, type Tier } from '@/lib/whitelist/allocation'
import { checkRateLimit, clientIp } from '@/lib/whitelist/rate-limit'
import { CHARACTERS } from '@/lib/quiz/content'

interface ValidateRequestBody {
  followAttested: boolean
  retweetAttested: boolean
  likeAttested: boolean
  walletAddress: string
  referralCode: string | null
  characterSlug: string | null
}

interface ValidateResponseBody {
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
  tier: Tier | null
}

const EMPTY_MARKS: ValidateResponseBody['marks'] = {
  follow: 'no',
  repost: 'no',
  like: 'no',
  wallet: 'no',
}

const VALID_CHARACTER_SLUGS = new Set(
  Object.values(CHARACTERS).map((character) => character.slug),
)

export async function POST(
  request: Request,
): Promise<NextResponse<ValidateResponseBody>> {
  // Ahead of auth: allocation attempts are the one action here that writes
  // a whitelist spot, so scripted retries are the thing worth capping —
  // checked before the session/DB round trips below, not after.
  const rateLimit = checkRateLimit(`validate:${clientIp(request)}`, {
    windowMs: 60_000,
    max: 10,
  })
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        marks: EMPTY_MARKS,
        reason: null,
        spotNumber: null,
        referralCode: null,
        tier: null,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
      },
    )
  }

  const session = await auth()
  if (!session?.xUserId || !session.xUsername) {
    return NextResponse.json(
      {
        ok: false,
        marks: EMPTY_MARKS,
        reason: null,
        spotNumber: null,
        referralCode: null,
        tier: null,
      },
      { status: 401 },
    )
  }

  let body: ValidateRequestBody
  try {
    body = (await request.json()) as ValidateRequestBody
  } catch {
    return NextResponse.json(
      {
        ok: false,
        marks: EMPTY_MARKS,
        reason: null,
        spotNumber: null,
        referralCode: null,
        tier: null,
      },
      { status: 400 },
    )
  }

  const walletValid = isValidEvmAddress(body.walletAddress)

  const marks: ValidateResponseBody['marks'] = {
    follow: body.followAttested ? 'yes' : 'no',
    repost: body.retweetAttested ? 'yes' : 'no',
    like: body.likeAttested ? 'yes' : 'no',
    wallet: walletValid ? 'yes' : 'no',
  }

  if (
    !body.followAttested ||
    !body.retweetAttested ||
    !body.likeAttested ||
    !walletValid
  ) {
    return NextResponse.json({
      ok: false,
      marks,
      reason: null,
      spotNumber: null,
      referralCode: null,
      tier: null,
    })
  }

  const result = await allocateSpot(supabaseServerClient, {
    xUserId: session.xUserId,
    xUsername: session.xUsername,
    walletAddress: toChecksumAddress(body.walletAddress),
    followAttested: true,
    retweetAttested: true,
    likeAttested: true,
    // A blank or missing code means "I don't have a referral code" and must
    // reach the allocator as null — "" would be treated as a code to look up.
    referralCode:
      typeof body.referralCode === 'string' && body.referralCode.trim() !== ''
        ? body.referralCode.trim().toUpperCase()
        : null,
    characterSlug:
      typeof body.characterSlug === 'string' &&
      VALID_CHARACTER_SLUGS.has(body.characterSlug.trim())
        ? body.characterSlug.trim()
        : null,
  })

  return NextResponse.json({
    ok: result.ok,
    marks,
    reason: result.reason,
    spotNumber: result.spotNumber,
    referralCode: result.referralCode,
    tier: result.tier,
  })
}
