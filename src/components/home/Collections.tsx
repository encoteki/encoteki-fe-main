import { ArrowRoundedButton } from '@/ui/Button'
import SectionHeading from '@/ui/text/SectionHeading'
import VerticalMarquee from '@/ui/VerticalMarquee'
import Link from 'next/link'

export default function Collections() {
  return (
    <section className="home-container flex flex-col justify-start gap-12 bg-(--khaki-90) md:gap-16">
      <div className="h-[600px] w-full bg-(--khaki-90)">
        <VerticalMarquee />
      </div>

      <SectionHeading
        title="NFT Collections"
        desc={
          <>
            The Satwas Band by{' '}
            <Link
              href={process.env.ARTIST_PORTFOLIO as string}
              target="_blank"
              className="underline decoration-transparent decoration-2 underline-offset-8 transition-all delay-150 duration-300 hover:text-(--green-10) hover:decoration-(--green-10)"
            >
              Rahel Kristhea
            </Link>{' '}
            are inspired by endangered animals in Indonesia
          </>
        }
      />

      <div>
        <ArrowRoundedButton
          className="text-base md:text-xl"
          variant="secondary"
        >
          Mint Now
        </ArrowRoundedButton>
      </div>
    </section>
  )
}
