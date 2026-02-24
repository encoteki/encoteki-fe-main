'use client'

import TextMarquee from '@/ui/text-marquee'
import Image, { StaticImageData } from 'next/image'
import { Anton } from 'next/font/google'

// Icons
import Base from '@/assets/chains/base.jpeg'
import Arbitrum from '@/assets/chains/arbitrum.svg'
import Lisk from '@/assets/chains/lisk.webp'
import Manta from '@/assets/chains/manta.png'

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
})

export default function Hero() {
  return (
    <section className="relative flex min-h-screen w-full flex-col overflow-hidden bg-red-50 pt-16 md:pt-20">
      {/* Marquee Header */}
      <div className="w-full shrink-0 border-b-2 border-black bg-red-50 py-2 md:py-3">
        <TextMarquee
          texts={[
            {
              text: 'Encoteki is now live on BASE',
              icon: <MarqueeIcon src={Base} alt="Base" />,
            },
            {
              text: 'Encoteki is now live on Arbitrum',
              icon: <MarqueeIcon src={Arbitrum} alt="Arbitrum" />,
            },
            {
              text: 'Encoteki is now live on Lisk',
              icon: <MarqueeIcon src={Lisk} alt="Lisk" />,
            },
            {
              text: 'Encoteki is now live on Manta',
              icon: <MarqueeIcon src={Manta} alt="Manta" />,
            },
          ]}
          separator={[
            'Contribute Now!',
            'We Cover Your Gas Fees!',
            'Join the Revolution!',
            'Mint Your NFT Today!',
          ]}
          className="text-sm font-medium uppercase sm:text-base md:text-xl"
          speed={125}
          repeat={6}
        />
      </div>

      {/* Main Content Wrapper */}
      <div className="flex w-full flex-1 items-center justify-center bg-linear-to-b from-blue-200 to-(--khaki-90)">
        <HeroGrid />
      </div>
    </section>
  )
}

const MarqueeIcon = ({
  src,
  alt,
}: {
  src: StaticImageData | string
  alt: string
}) => {
  return (
    <div className="relative flex h-6 w-6 shrink-0 items-center justify-center md:h-8 md:w-8">
      <Image
        src={src}
        alt={alt}
        fill
        className="rounded-md object-contain"
        sizes="32px"
        loading="lazy"
      />
    </div>
  )
}

function HeroGrid() {
  return (
    <section
      className={`relative flex h-full w-full flex-col items-center justify-center gap-8 overflow-hidden bg-transparent p-6 ${anton.variable}`}
    >
      <div className="flex w-full max-w-5xl flex-col items-center justify-center space-y-6 text-center">
        <div className="overflow-hidden">
          <h1 className="hero-text-anim font-anton text-5xl leading-[1.1] font-bold tracking-tight text-[#1a1a1a] uppercase sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl">
            A community building wildlife confidence.
          </h1>
        </div>
      </div>
    </section>
  )
}
