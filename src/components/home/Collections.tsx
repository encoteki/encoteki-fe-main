import { ArrowRoundedButton } from '@/ui/Button'
import SectionHeading from '@/ui/text/SectionHeading'
import VerticalMarquee from '@/ui/VerticalMarquee'

export default function Collections() {
  return (
    <section className="home-container flex flex-col justify-start gap-8 bg-(--khaki-90) md:gap-16">
      <div className="h-[600px] w-full bg-(--khaki-90)">
        <VerticalMarquee />
      </div>

      <SectionHeading
        title="NFT Collections"
        desc="The Satwas Band, are inspired by endangered animals in Indonesia"
      />

      <div>
        <ArrowRoundedButton variant="secondary">Mint Now</ArrowRoundedButton>
      </div>
    </section>
  )
}
