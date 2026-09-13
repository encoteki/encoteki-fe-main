import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import sharp from 'sharp'
import { CHARACTERS } from '@/lib/quiz/content'

export const alt = 'Which Satwas Are You? — Encoteki character result card'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const character = Object.values(CHARACTERS).find((c) => c.slug === slug)

  // Satori (next/og's renderer) can't decode WebP <img> sources — only
  // PNG/JPEG — so the source WebP is transcoded to PNG at request time
  // rather than keeping a second on-disk copy of every card.
  const cardWebp = await readFile(
    join(process.cwd(), 'src/assets/quiz-cards', `${slug}.webp`),
  ).catch(() => null)
  const cardPng = cardWebp
    ? await sharp(cardWebp).resize({ width: 326 }).png().toBuffer()
    : null
  const cardDataUri = cardPng
    ? `data:image/png;base64,${cardPng.toString('base64')}`
    : null

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 56,
        backgroundColor: character?.cardPlaceholderColor ?? '#f6f6ec',
        border: '12px solid #1a1a1a',
      }}
    >
      {cardDataUri ? (
        <img
          src={cardDataUri}
          alt=""
          width={326}
          height={580}
          style={{ borderRadius: 16, border: '4px solid #1a1a1a' }}
        />
      ) : (
        <div style={{ fontSize: 140 }}>{character?.emoji ?? '🐾'}</div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 56, fontWeight: 900, color: '#1a1a1a' }}>
          {character ? character.name : 'Encoteki'}
        </div>
        <div style={{ fontSize: 28, color: '#1a1a1a', marginTop: 8 }}>
          {character ? character.title : 'Which Satwas Are You?'}
        </div>
      </div>
    </div>,
    { ...size },
  )
}
