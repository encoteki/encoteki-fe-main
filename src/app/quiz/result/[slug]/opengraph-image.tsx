import { ImageResponse } from 'next/og'
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

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: character?.cardPlaceholderColor ?? '#f6f6ec',
        border: '12px solid #1a1a1a',
      }}
    >
      <div style={{ fontSize: 100 }}>{character?.emoji ?? '🐾'}</div>
      <div
        style={{
          fontSize: 64,
          fontWeight: 900,
          color: '#1a1a1a',
          marginTop: 16,
        }}
      >
        {character ? character.name : 'Encoteki'}
      </div>
      <div style={{ fontSize: 32, color: '#1a1a1a', marginTop: 8 }}>
        {character ? character.title : 'Which Satwas Are You?'}
      </div>
    </div>,
    { ...size },
  )
}
