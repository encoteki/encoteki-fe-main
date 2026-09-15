import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import sharp from 'sharp'
import { supabaseServerClient } from '@/lib/whitelist/supabase'
import { checkRateLimit, clientIp } from '@/lib/whitelist/rate-limit'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const rateLimit = checkRateLimit(`card-image:${clientIp(request)}`, {
    windowMs: 60_000,
    max: 20,
  })
  if (!rateLimit.allowed) {
    return new Response('Too many requests', {
      status: 429,
      headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
    })
  }

  const { code } = await params

  const { data: referral, error } = await supabaseServerClient()
    .from('referral_codes')
    .select('owner_entry_id')
    .eq('code', code.trim().toUpperCase())
    .maybeSingle()
  if (error) throw error
  if (!referral?.owner_entry_id) {
    return new Response('Not found', { status: 404 })
  }

  const { data: entry, error: entryError } = await supabaseServerClient()
    .from('whitelist_entries')
    .select('character_slug, x_username')
    .eq('id', referral.owner_entry_id)
    .maybeSingle()
  if (entryError) throw entryError
  if (!entry?.character_slug) {
    return new Response('Not found', { status: 404 })
  }

  // Same reason opengraph-image.tsx transcodes to PNG at request time:
  // Satori can't decode a WebP <img> source, only PNG/JPEG.
  const cardWebp = await readFile(
    join(
      process.cwd(),
      'src/assets/quiz-cards-referral',
      `${entry.character_slug}.webp`,
    ),
  ).catch(() => null)
  if (!cardWebp) {
    return new Response('Not found', { status: 404 })
  }
  const cardPng = await sharp(cardWebp)
    .png()
    .toBuffer()
    .catch(() => null)
  if (!cardPng) {
    return new Response('Not found', { status: 404 })
  }
  const cardDataUri = `data:image/png;base64,${cardPng.toString('base64')}`

  const image = new ImageResponse(
    <div
      style={{
        width: 1080,
        height: 1920,
        display: 'flex',
        position: 'relative',
      }}
    >
      <img
        src={cardDataUri}
        alt=""
        width={1080}
        height={1920}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
      {/* Positioned against the blank space the source art already
            reserves beneath its own baked-in "MINT FREE, USE MY CODE:"
            line. Sits a little higher than that blank band's vertical
            center (bottom: 60, not 44) so it reads as attached to the
            "MINT FREE" line above rather than floating in the middle of
            the gap; still well clear of the card's bottom edge.

            fontWeight below is declared but Satori has no bold face to
            actually draw it with — no `fonts` option is passed, so this
            falls back to Satori's bundled default face. A real fix needs
            a genuine STATIC (non-variable) TTF/OTF bold file loaded via
            `fonts`: the Google Fonts CDN only serves woff2 for Outfit
            (Satori's bundled @vercel/og parser only reads ttf/otf), the
            @fontsource/outfit npm package only ships woff/woff2 too, and
            the one variable-font TTF source tried (google/fonts' GitHub
            mirror) crashes this Satori build's font parser outright on
            its fvar table (TypeError parsing named axis instances) — a
            real, reproducible bug in this dependency combination, not a
            config mistake. Confirmed via a standalone render script
            against the actual bundled next/og, not assumed. */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          fontSize: 44,
          fontWeight: 900,
          letterSpacing: 4,
          color: '#246234',
        }}
      >
        @{entry.x_username} | {code.trim().toUpperCase()}
      </div>
    </div>,
    {
      width: 1080,
      height: 1920,
    },
  )

  // Satori/next/og only ever emits PNG — there's no format option on
  // ImageResponse — so the JPEG conversion happens here, after the fact,
  // through the same sharp already in this file's webp→png step above.
  // The card is a full-bleed background with no transparency (the source
  // art covers all 1080x1920), so JPEG loses nothing but file size; quality
  // 92 keeps the baked-in referral-code text edges clean.
  const pngBuffer = Buffer.from(await image.arrayBuffer())
  const jpegBuffer = await sharp(pngBuffer)
    .jpeg({ quality: 92 })
    .toBuffer()
    .catch(() => null)
  if (!jpegBuffer) {
    return new Response('Not found', { status: 404 })
  }

  return new Response(new Uint8Array(jpegBuffer), {
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `attachment; filename="encoteki-whitelist-${code.trim().toUpperCase()}.jpg"`,
    },
  })
}
