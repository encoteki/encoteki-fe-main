import { BrutalismButton } from '@/ui/buttons'
import SectionHeading from '@/ui/heading/section-heading'
import VerticalMarquee from '@/ui/vertical-marquee'
import Link from 'next/link'

export default function Collections() {
  return (
    <section className="home-container flex flex-col justify-start gap-12 bg-(--khaki-90) md:gap-16">
      <div className="h-150 w-full bg-(--khaki-90)">
        <VerticalMarquee />
      </div>

      <SectionHeading
        title="NFT Collections"
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

      <div>
        <BrutalismButton
          label="Mint Now"
          className="text-base md:text-xl"
          href={process.env.NEXT_PUBLIC_APP_MINT ?? ''}
        />
      </div>
    </section>
  )
}
