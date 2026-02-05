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
        desc={
          <>
            The Satwas Band by{' '}
            <Link
              href={process.env.ARTIST_PORTFOLIO ?? ''}
              target="_blank"
              className="font-medium text-(--primary-green) underline decoration-transparent decoration-2 underline-offset-8 transition-all delay-150 duration-300 hover:decoration-(--primary-green)"
            >
              Rahel Kristhea
            </Link>{' '}
            are inspired by endangered animals in Indonesia
          </>
        }
      />

      <div>
        <BrutalismButton
          bgColor="bg-(--green-90)"
          label="Mint Now"
          className="text-base md:text-xl"
        />
      </div>
    </section>
  )
}
