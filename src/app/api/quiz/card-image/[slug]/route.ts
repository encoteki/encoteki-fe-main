import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { isRateLimited } from '@/lib/rate-limit'
import { CHARACTERS } from '@/lib/quiz/content'

// Serves the same static card art result-actions.tsx's download button used
// to save directly (character.cardImage.src, a .webp asset) — re-encoded to
// JPEG on the way out, so the quiz's own download matches the whitelist
// card-image route's format without duplicating a second image asset set.
const VALID_SLUGS = new Set(
  Object.values(CHARACTERS).map((character) => character.slug),
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (isRateLimited(request, 'quiz-card-image')) {
    return NextResponse.json(
      { message: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': '60' } },
    )
  }

  const { slug } = await params
  if (!VALID_SLUGS.has(slug)) {
    return new Response('Not found', { status: 404 })
  }

  const cardWebp = await readFile(
    join(process.cwd(), 'src/assets/quiz-cards', `${slug}.webp`),
  ).catch(() => null)
  if (!cardWebp) {
    return new Response('Not found', { status: 404 })
  }

  // The card art is a full-bleed illustration with no transparency, so
  // JPEG loses nothing but file size.
  const cardJpeg = await sharp(cardWebp)
    .jpeg({ quality: 92 })
    .toBuffer()
    .catch(() => null)
  if (!cardJpeg) {
    return new Response('Not found', { status: 404 })
  }

  return new Response(new Uint8Array(cardJpeg), {
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `attachment; filename="${slug}-satwas-card.jpg"`,
    },
  })
}
