import type { Metadata } from 'next'

const LIVE_LOGO = '/encoteki.png'
const TITLE = 'Which Satwas Are You?'
const DESCRIPTION =
  'A 6-question personality quiz matching you to one of the Satwas Band — six characters inspired by real endangered Indonesian animals.'

// `quiz/page.tsx` is a Client Component and can't export `metadata` itself,
// so this layout carries it. Every field a share card needs is declared
// explicitly — Next merges `openGraph`/`twitter` shallowly, so omitting
// `images` here would silently drop the root layout's OG image instead of
// inheriting it.
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/quiz' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Encoteki',
    title: TITLE,
    description: DESCRIPTION,
    url: '/quiz',
    images: [{ url: LIVE_LOGO, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@encoteki',
    title: TITLE,
    description: DESCRIPTION,
  },
}

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
