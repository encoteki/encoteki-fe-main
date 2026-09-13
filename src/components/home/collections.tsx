'use client'

import { BrutalismButton } from '@/ui/buttons'
import SectionHeading from '@/ui/heading/section-heading'
import VerticalMarquee from '@/ui/vertical-marquee'
import Link from 'next/link'
import posthog from 'posthog-js'

export default function Collections() {
  return (
    <section className="home-container flex flex-col justify-start gap-12 bg-(--khaki-90) md:gap-16">
      <div className="h-150 w-full bg-(--khaki-90)">
        <VerticalMarquee />
      </div>

      <SectionHeading
        title="The Satwas Band"
        titleClassName="font-black"
        desc={
          <>
            The Satwas Band by{' '}
            <Link
              href={process.env.NEXT_PUBLIC_ARTIST_PORTFOLIO ?? ''}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-(--primary-green) underline decoration-transparent decoration-2 underline-offset-8 transition-all delay-150 duration-300 hover:decoration-(--primary-green)"
            >
              Rahel Kristhea
            </Link>
            {', '}
            <span className="font-serif text-(--neutral-40) italic">
              inspired
            </span>{' '}
            by endangered animals in Indonesia.
          </>
        }
        descClassName="text-[var(--neutral-30)]"
      />

      <div className="flex flex-wrap gap-4">
        <BrutalismButton
          label="Read our Story"
          className="text-base md:text-xl"
          href="/story"
          onClick={() => posthog.capture('read_story_clicked')}
        />
        <BrutalismButton
          label="Know Your Satwas"
          className="text-base md:text-xl"
          bgColor="bg-[#ccf281]"
          href="/quiz"
          onClick={() => posthog.capture('quiz_cta_clicked')}
        />
      </div>
    </section>
  )
}
