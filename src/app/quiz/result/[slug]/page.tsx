import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CHARACTERS } from '@/lib/quiz/content'
import ResultActions from '@/components/quiz/result-actions'

function findCharacterBySlug(slug: string) {
  return Object.values(CHARACTERS).find((c) => c.slug === slug) ?? null
}

export function generateStaticParams() {
  return Object.values(CHARACTERS).map((c) => ({ slug: c.slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const character = findCharacterBySlug(slug)
  if (!character) return {}

  const title = `I'm ${character.name} — ${character.title}`
  const description = character.shareLine

  return {
    title,
    description,
    alternates: { canonical: `/quiz/result/${character.slug}` },
    // Next.js merges `openGraph`/`twitter` shallowly per top-level key, not
    // deeply — declaring only `title`/`description` here replaces (rather
    // than extends) the root layout's `twitter` object, silently dropping
    // `card`/`creator` and downgrading every shared result to a generic
    // thumbnail. Every field a share card needs is set explicitly here.
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: 'Encoteki',
      title,
      description,
      url: `/quiz/result/${character.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@encoteki',
      title,
      description,
    },
  }
}

export default async function QuizResultPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const character = findCharacterBySlug(slug)
  if (!character) notFound()

  return (
    <main className="home-container flex min-h-screen flex-col items-center justify-center bg-(--khaki-90) text-center">
      {/* The card art already carries the name, animal, MBTI, instrument,
          title, and quote as part of its illustration — an h1 stays for
          heading navigation and SEO without duplicating that text visibly. */}
      <h1 className="sr-only">
        {character.name} — {character.title}
      </h1>
      <p className="font-mono text-xs tracking-widest text-(--neutral-30) uppercase">
        You are
      </p>
      <Image
        src={character.cardImage}
        alt={`${character.name} — ${character.animal}, ${character.mbti}, ${character.title}. Plays ${character.instrument}.`}
        className="mt-4 w-72 rounded-2xl border-2 border-(--primary-black) sm:w-96"
        priority
      />

      <ResultActions character={character} />

      <Link
        href="/quiz"
        className="mt-6 text-sm font-semibold text-(--primary-black) underline decoration-2 underline-offset-4 hover:text-(--primary-green) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary-black)"
      >
        Retake the quiz
      </Link>
    </main>
  )
}
