import AnimateText from '@/ui/AnimateText'
import TextMarquee from '@/ui/TextMarquee'
import Image, { StaticImageData } from 'next/image'

// Icons
import Base from '@/assets/chains/base.jpeg'
import Arbitrum from '@/assets/chains/arbitrum.svg'
import Lisk from '@/assets/chains/lisk.webp'
import Manta from '@/assets/chains/manta.png'

export default function Hero() {
  return (
    <section className="relative flex h-screen w-full flex-col pt-16 md:pt-20">
      <div className="w-full shrink-0 bg-red-50 py-2 md:py-3">
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
          className="text-base font-medium uppercase md:text-xl"
          speed={125}
          repeat={6}
        />
      </div>

      <div className="flex min-h-0 w-full flex-1 flex-col border-y border-black">
        <div className="flex h-full w-full flex-col md:flex-row">
          {/* LEFT (Desktop) / TOP (Mobile) */}
          <div className="flex h-full w-full flex-col items-center justify-center border-b border-black bg-[#e7fad3] text-black md:w-1/2 md:border-r md:border-b-0">
            <div className="flex flex-col p-10 text-left text-white md:gap-4 md:p-20">
              <AnimateText
                text="Encoteki"
                className="mb-4 text-4xl font-bold text-black md:text-6xl"
                delay={0}
              />
              <AnimateText
                text="Innovation for Future"
                className="mb-4 text-4xl font-bold text-black md:text-6xl"
                delay={0.5}
                duration={1}
              />
            </div>
          </div>

          {/* RIGHT (Desktop) / BOTTOM (Mobile) */}
          <div className="w-full bg-[#d2e2e7] md:w-1/2">
            <div className="relative flex h-full min-h-[300px] items-center justify-center md:min-h-full"></div>
          </div>
        </div>
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
    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
      <Image
        src={src}
        alt={alt}
        fill
        className="rounded-md object-contain"
        sizes="32px"
        priority
      />
    </div>
  )
}
