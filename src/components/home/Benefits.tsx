'use client'

import SectionHeading from '@/ui/text/SectionHeading'
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Lock, Layers, Zap } from 'lucide-react'
import { AbstractSeparator } from '@/ui/AbstractSeparator'
import { BrutalismButton } from '@/ui/Button'

const cards = [
  {
    id: 1,
    title: 'Secure',
    color: 'bg-[#FFD94A]',
    icon: <Zap size={48} className="text-black" />,
    illustration: (
      <div className="relative flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28 md:h-32 md:w-32">
        <div className="relative z-10 flex h-20 w-16 flex-col items-center justify-center rounded-t-lg rounded-b-[2.5rem] border-2 border-black bg-green-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:h-24 sm:w-20 md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col items-center">
            <div className="h-4 w-5 rounded-t-full border-2 border-b-0 border-black sm:h-5 sm:w-6" />
            <div className="flex h-6 w-7 items-center justify-center rounded-md border-2 border-black bg-white sm:h-7 sm:w-8">
              <div className="h-2 w-1.5 rounded-full bg-black sm:h-3 sm:w-2" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: 'Profit Sharing',
    color: 'bg-[#E9D5FF]',
    icon: <Layers size={48} className="text-black" />,
    illustration: (
      <div className="relative flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28 md:h-32 md:w-32">
        <div className="absolute h-20 w-20 rounded-full border-2 border-black bg-purple-200 opacity-50 sm:h-24 sm:w-24 md:h-28 md:w-28"></div>
        <div className="absolute top-2 left-2 z-10 flex h-12 w-12 -rotate-12 items-center justify-center rounded-full border-2 border-black bg-[#FFD94A] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:h-14 sm:w-14 md:h-16 md:w-16 md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="h-8 w-8 rounded-full border-2 border-black opacity-20 sm:h-10 sm:w-10"></div>
        </div>
        <div className="absolute right-2 bottom-4 z-20 flex h-10 w-10 rotate-12 items-center justify-center rounded-full border-2 border-black bg-green-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:h-11 sm:w-11 md:h-12 md:w-12 md:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <div className="h-1 w-5 bg-black sm:w-6"></div>
          <div className="absolute h-5 w-1 bg-black sm:h-6"></div>
        </div>
        <div className="absolute bottom-2 left-4 z-0 h-8 w-8 rotate-45 rounded-full border-2 border-black bg-white sm:h-9 sm:w-9 md:h-10 md:w-10"></div>
      </div>
    ),
  },
  {
    id: 3,
    title: 'Freebies',
    color: 'bg-[#60A5FA]',
    icon: <Lock size={48} className="text-black" />,
    illustration: (
      <div className="relative flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28 md:h-32 md:w-32">
        <div className="absolute top-2 left-2 z-0 flex h-12 w-12 -rotate-12 items-center justify-center rounded-full border-2 border-black bg-green-400 sm:h-14 sm:w-14 md:h-16 md:w-16">
          <div className="h-6 w-6 rounded-tr-[15px] rounded-bl-[15px] border-2 border-black bg-white sm:h-7 sm:w-7 md:h-8 md:w-8 md:rounded-tr-[20px] md:rounded-bl-[20px]"></div>
        </div>
        <div className="absolute right-2 bottom-2 z-10 flex h-12 w-12 rotate-12 items-center justify-center rounded-full border-2 border-black bg-orange-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:h-14 sm:w-14 md:h-16 md:w-16 md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="relative mt-1">
            <div className="h-4 w-5 rounded-full bg-black sm:h-5 sm:w-6"></div>
            <div className="absolute -top-2 left-0 h-1.5 w-1.5 rounded-full bg-black sm:-top-3 sm:h-2 sm:w-2"></div>
            <div className="absolute -top-3 left-1.5 h-1.5 w-1.5 rounded-full bg-black sm:-top-4 sm:left-2 sm:h-2 sm:w-2"></div>
            <div className="absolute -top-2 left-3.5 h-1.5 w-1.5 rounded-full bg-black sm:-top-3 sm:left-4 sm:h-2 sm:w-2"></div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: 'Partner Discount',
    href: '/partners',
    color: 'bg-[#FF9CA6]',
    buttonText: 'Deals',
    icon: <Layers size={48} className="text-black" />,
    illustration: (
      <div className="relative flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28 md:h-32 md:w-32">
        <div className="absolute top-2 right-8 h-12 w-1 rotate-12 bg-black sm:right-10 sm:h-14 md:h-16"></div>
        <div className="relative z-10 flex h-16 w-16 rotate-45 items-center justify-center rounded-lg border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:h-18 sm:w-18 md:h-20 md:w-20 md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex -rotate-45 flex-col items-center gap-0.5 sm:gap-1">
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full border-2 border-black bg-white sm:h-2.5 sm:w-2.5 md:h-3 md:w-3"></div>
              <div className="h-2 w-2 bg-transparent sm:h-2.5 sm:w-2.5 md:h-3 md:w-3"></div>
            </div>
            <div className="h-0.5 w-8 -rotate-45 rounded-full bg-black sm:h-1 sm:w-9 md:w-10"></div>
            <div className="flex gap-1">
              <div className="h-2 w-2 bg-transparent sm:h-2.5 sm:w-2.5 md:h-3 md:w-3"></div>
              <div className="h-2 w-2 rounded-full border-2 border-black bg-white sm:h-2.5 sm:w-2.5 md:h-3 md:w-3"></div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: 'Event Pass',
    color: 'bg-[#86EFAC]',
    icon: <Layers size={48} className="text-black" />,
    illustration: (
      <div className="relative flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28 md:h-32 md:w-32">
        <div className="absolute top-2 right-2 h-12 w-20 rotate-12 rounded-lg border-2 border-black bg-black opacity-20 sm:h-14 sm:w-24 md:h-16 md:w-28"></div>
        <div className="relative z-10 flex h-12 w-20 -rotate-6 items-center justify-between rounded-lg border-2 border-black bg-white px-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:h-14 sm:w-24 md:h-16 md:w-28">
          <div className="absolute left-6 h-full border-r-2 border-dashed border-black sm:left-7 md:left-8"></div>
          <div className="ml-7 flex flex-col items-center sm:ml-8 md:ml-10">
            <div className="h-0 w-0 border-r-8 border-b-12 border-l-8 border-r-transparent border-b-green-600 border-l-transparent sm:border-r-[9px] sm:border-b-14 sm:border-l-[9px] md:border-r-10 md:border-b-16 md:border-l-10"></div>
            <div className="-mt-1 h-0 w-0 border-r-10 border-b-16 border-l-10 border-r-transparent border-b-green-600 border-l-transparent sm:border-r-12 sm:border-b-18 sm:border-l-12 md:border-r-14 md:border-b-20 md:border-l-14"></div>
            <div className="h-2 w-1.5 bg-black sm:h-2.5 md:h-3 md:w-2"></div>
          </div>
          <div className="flex flex-col gap-0.5 sm:gap-1">
            <div className="h-0.5 w-3 rounded-full bg-black sm:w-3.5 md:h-1 md:w-4"></div>
            <div className="h-0.5 w-2 rounded-full bg-black sm:w-2.5 md:h-1 md:w-3"></div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    title: 'DAO',
    color: 'bg-[#FDBA74]',
    buttonText: 'Visit DAO',
    icon: <Zap size={48} className="text-black" />,
    illustration: (
      <div className="relative flex h-24 w-24 items-center justify-center pt-3 sm:h-28 sm:w-28 md:h-32 md:w-32 md:pt-4">
        <div className="absolute top-0 z-20 flex h-12 w-9 -rotate-12 items-center justify-center rounded-sm border-2 border-black bg-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] sm:h-14 sm:w-10 md:h-16 md:w-12 md:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="h-2 w-4 -rotate-45 border-b-[3px] border-l-[3px] border-green-500 sm:h-2.5 sm:w-5 md:h-3 md:w-6 md:border-b-4 md:border-l-4"></div>
        </div>
        <div className="relative z-10 flex h-14 w-16 flex-col items-center rounded-lg border-2 border-black bg-gray-300 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:h-16 sm:w-20 md:h-20 md:w-24 md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex h-3 w-full items-center justify-center rounded-t-md border-b-2 border-black bg-gray-400 sm:h-3.5 md:h-4">
            <div className="h-1.5 w-10 rounded-full bg-black sm:w-12 md:h-2 md:w-14"></div>
          </div>
          <div className="mt-3 flex h-4 w-10 items-center justify-center border-2 border-black bg-white sm:mt-3.5 sm:h-5 sm:w-12 md:mt-4 md:h-6 md:w-16">
            <div className="h-1.5 w-6 rounded-full bg-black opacity-20 sm:w-8 md:h-2 md:w-10"></div>
          </div>
        </div>
      </div>
    ),
  },
]

export default function Benefits() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const wrapper = wrapperRef.current
      if (!wrapper) return

      const getScrollAmount = () => {
        let amount = wrapper.scrollWidth - window.innerWidth
        return -(amount + 48)
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () =>
            `+=${Math.abs(getScrollAmount()) + window.innerHeight * 0.5}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })

      // Delay
      tl.to({}, { duration: 0.2 })

      // Horizontal scroll
      tl.to(wrapper, {
        x: getScrollAmount,
        ease: 'none',
        duration: 1,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="bg-[#dceeff]">
      <AbstractSeparator fillColor="#f6f6ec" />

      <section className="relative overflow-hidden bg-linear-to-b from-[#dceeff] to-[#F3F4F6]">
        <div
          ref={sectionRef}
          className="flex h-screen w-full flex-col justify-center overflow-hidden"
        >
          <div className="mb-8 w-full px-4 text-center md:mb-16 lg:mb-20">
            <SectionHeading
              title="Benefits"
              desc="Discover the benefits as an owner of The Satwas Band NFT"
              align="center"
            />
          </div>

          <div ref={wrapperRef} className="flex w-max gap-6 px-4 md:px-16">
            {cards.map((card, index) => (
              <CardItem key={`${card.id}-${index}`} data={card} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function CardItem({ data }: { data: Partial<(typeof cards)[0]> }) {
  return (
    <div
      className={`relative flex h-[300px] w-[280px] shrink-0 flex-col justify-between rounded-4xl border-[3px] border-black p-6 shadow transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] sm:h-[350px] sm:w-[320px] sm:p-7 md:h-[400px] md:w-[360px] md:p-8 md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] xl:h-[450px] xl:w-[400px] ${data.color} `}
    >
      <div>
        <h3 className="mb-2 text-4xl leading-[0.85] font-bold text-black uppercase sm:mb-3 sm:text-5xl md:mb-4 md:text-6xl">
          {data.title}
        </h3>
      </div>

      <div className="flex items-end justify-between">
        {data.buttonText && (
          <div>
            <BrutalismButton
              label={data.buttonText}
              className="bg-white"
              href={data.href}
            />
          </div>
        )}

        <div className="pointer-events-none ml-auto translate-x-1 translate-y-1 transform sm:translate-x-2 sm:translate-y-2">
          {data.illustration}
        </div>
      </div>
    </div>
  )
}
