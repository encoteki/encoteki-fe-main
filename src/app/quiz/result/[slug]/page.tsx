import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CHARACTERS } from '@/lib/quiz/content'
import ResultShareActions from '@/components/quiz/result-share-actions'

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
    <main className="home-container flex min-h-screen flex-col items-center justify-center gap-8 bg-(--khaki-90) py-16 text-center">
      <div className="w-full max-w-xl rounded-4xl border-3 border-(--primary-black) bg-white p-8 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] md:p-12">
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
          className="mx-auto mt-4 w-56 rounded-xl sm:w-64"
          priority
        />

        <ul className="mx-auto mt-6 flex max-w-sm flex-col gap-2 text-left text-(--neutral-30)">
          {character.description.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <ResultShareActions character={character} />

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-(--primary-black)">
          <Link
            href="/quiz"
            className="underline decoration-2 underline-offset-4 hover:text-(--primary-green) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary-black)"
          >
            Take the quiz again
          </Link>
          <Link
            href="/story"
            className="underline decoration-2 underline-offset-4 hover:text-(--primary-green) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary-black)"
          >
            Meet the whole band
          </Link>
        </div>
      </div>
    </main>
  )
}
