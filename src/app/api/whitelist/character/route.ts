import { NextResponse } from 'next/server'
import { auth } from '@/lib/whitelist/auth'
import { supabaseServerClient } from '@/lib/whitelist/supabase'
import { checkRateLimit, clientIp } from '@/lib/whitelist/rate-limit'
import { CHARACTERS } from '@/lib/quiz/content'

// Links a quiz result to an ALREADY-whitelisted account — the reverse
// direction of the normal quiz → whitelist signup handoff (which carries
// characterSlug through /api/whitelist/validate at signup time instead).
// Reached only from the quiz's own result screen, and only when the
// visitor is signed in with an entry that has no character_slug yet (see
// quiz/page.tsx's `linkToWhitelist` check) — never overwrites one already
// set.
interface LinkCharacterRequestBody {
  characterSlug: string
}

interface LinkCharacterResponseBody {
  ok: boolean
  characterSlug: string | null
}

const VALID_CHARACTER_SLUGS = new Set(
  Object.values(CHARACTERS).map((character) => character.slug),
)

export async function POST(
  request: Request,
): Promise<NextResponse<LinkCharacterResponseBody | { error: string }>> {
  const rateLimit = checkRateLimit(`character:${clientIp(request)}`, {
    windowMs: 60_000,
    max: 10,
  })
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'rate_limited' },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
      },
    )
  }

  const session = await auth()
  if (!session?.xUserId) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
  }

  const body = (await request
    .json()
    .catch(() => null)) as Partial<LinkCharacterRequestBody> | null
  const characterSlug =
    typeof body?.characterSlug === 'string' ? body.characterSlug.trim() : ''
  if (!VALID_CHARACTER_SLUGS.has(characterSlug)) {
    return NextResponse.json({ error: 'invalid_character' }, { status: 400 })
  }

  // Scoped to x_user_id (service-role bypasses RLS, so this filter is what
  // keeps a caller from touching anyone else's entry) and gated on
  // character_slug IS NULL so a set-once character can never be
  // overwritten by a stray retry, even a concurrent one.
  const { data: updated, error: updateError } = await supabaseServerClient()
    .from('whitelist_entries')
    .update({ character_slug: characterSlug })
    .eq('x_user_id', session.xUserId)
    .is('character_slug', null)
    .select('character_slug')
    .maybeSingle()
  if (updateError) throw updateError

  if (updated) {
    return NextResponse.json({
      ok: true,
      characterSlug: updated.character_slug,
    })
  }

  // Nothing updated — either this account has no entry at all, or its
  // character_slug was already set. Distinguish so the caller gets an
  // honest answer either way.
  const { data: entry, error: entryError } = await supabaseServerClient()
    .from('whitelist_entries')
    .select('character_slug')
    .eq('x_user_id', session.xUserId)
    .maybeSingle()
  if (entryError) throw entryError

  if (!entry) {
    return NextResponse.json({ error: 'no_entry' }, { status: 404 })
  }

  return NextResponse.json({ ok: true, characterSlug: entry.character_slug })
}
