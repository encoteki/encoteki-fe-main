'use client'

import SectionHeading from '@/ui/text/SectionHeading'
import { useRef, useState, useEffect } from 'react'
import {
  ArrowRight,
  ArrowLeft,
  Rocket,
  Globe2,
  Building2,
  Infinity,
} from 'lucide-react'
import { AbstractSeparator } from '@/ui/AbstractSeparator'

const services = [
  {
    id: 1,
    title: 'Genesis',
    description:
      "Establishing the ecosystem's foundation through platform deployment, strategic alliances, and the debut of exclusive physical collectibles.",
    color: '#FFD94A',
    Icon: Rocket,
  },
  {
    id: 2,
    title: 'Expansion',
    description:
      'Scaling the ecosystem by enhancing digital utility, fostering community through local collaborations, and laying the groundwork for subsidiaries.',
    color: '#60A5FA',
    Icon: Globe2,
  },
  {
    id: 3,
    title: 'Impact',
    description:
      'Solidifying the ecosystem structure through the official launch of subsidiaries and evolved NFT utility, while driving tangible change via community projects.',
    color: '#E9D5FF',
    Icon: Building2,
  },
  {
    id: 4,
    title: 'Legacy',
    description:
      'Expanding boundaries through a fully immersive Metaverse presence and a specialized educational platform, culminating in full DAO governance.',
    color: '#FB7185',
    Icon: Infinity,
  },
]

export default function Roadmap() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const scrollToItem = (index: number) => {
    const container = scrollContainerRef.current
    const item = itemsRef.current[index]

    if (container && item) {
      const scrollLeft =
        item.offsetLeft - container.clientWidth / 2 + item.clientWidth / 2

      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      })
    }
  }

  const handleNav = (direction: 'left' | 'right') => {
    let newIndex = activeIndex
    if (direction === 'left') {
      newIndex = Math.max(0, activeIndex - 1)
    } else {
      newIndex = Math.min(services.length - 1, activeIndex + 1)
    }
    setActiveIndex(newIndex)
  }

  useEffect(() => {
    scrollToItem(activeIndex)
  }, [activeIndex])

  return (
    <section className="border-b-2 border-black bg-(--khaki-90) md:min-h-screen">
      <AbstractSeparator className="w-full" fillColor="#F3F4F6" />

      {/* --- Heading --- */}
      <div className="py-16 md:py-24 lg:py-32">
        <div className="px-4 pb-8 text-center">
          <SectionHeading
            title="Roadmap"
            desc="The blueprint of our sustainable growth ahead"
            className="text-4xl font-black md:text-6xl lg:text-7xl"
            align="center"
          />
        </div>

        {/* --- Carousel Area --- */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-[calc(50%-140px)] py-6 md:gap-8 md:px-[calc(50%-175px)] md:py-12 xl:gap-12 xl:px-[calc(50%-190px)]"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {services.map((service, index) => {
              const isActive = index === activeIndex

              return (
                <div
                  key={service.id}
                  ref={(el) => {
                    itemsRef.current[index] = el
                  }}
                  onClick={() => setActiveIndex(index)}
                  className={`Tinggi ini disesuaikan agar cukup menampung kartu saat scale max */ relative flex h-[450px] w-[280px] shrink-0 cursor-pointer snap-center items-center justify-center md:h-[550px] md:w-[350px] xl:h-[600px] xl:w-[380px]`}
                >
                  {/* Inner Cards*/}
                  <div
                    className={`flex w-full flex-col items-center rounded-4xl border-4 border-black bg-white p-6 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-500 ease-out will-change-transform md:rounded-[2.5rem] md:p-10 xl:p-12 ${
                      isActive
                        ? 'z-10 scale-100 opacity-100 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] md:scale-110 md:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]'
                        : 'z-0 scale-90 opacity-60 blur-[1px] hover:opacity-90 hover:blur-none'
                    } `}
                  >
                    {/* Icon Circle */}
                    <div
                      className={`mb-4 flex items-center justify-center rounded-full border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 md:mb-6 md:h-24 md:w-24 xl:mb-8 ${
                        isActive
                          ? 'h-20 w-20 scale-110 md:h-24 md:w-24'
                          : 'h-16 w-16 scale-100 md:h-20 md:w-20'
                      } `}
                      style={{ backgroundColor: service.color }}
                    >
                      <service.Icon
                        className="h-8 w-8 text-black md:h-12 md:w-12 xl:h-14 xl:w-14"
                        strokeWidth={2}
                      />
                    </div>

                    {/* Phase Tag */}
                    <div className="mb-3 rounded-full border-2 border-black bg-black px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase md:mb-4 md:px-4 md:text-xs xl:mb-5">
                      Phase 0{service.id}
                    </div>

                    {/* Title */}
                    <h3 className="mb-3 text-xl leading-tight font-black tracking-tight text-black uppercase md:mb-4 md:text-3xl xl:mb-5 xl:text-4xl">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="font-mono text-xs leading-relaxed text-gray-700 md:text-base xl:text-lg">
                      {service.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* --- Buttons --- */}
          <div className="mt-4 flex items-center justify-center gap-4 md:mt-12 md:gap-6">
            <button
              onClick={() => handleNav('left')}
              disabled={activeIndex === 0}
              className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-3 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none md:h-14 md:w-14"
              aria-label="Scroll Left"
            >
              <ArrowLeft
                className="h-5 w-5 text-black transition-transform group-hover:-translate-x-1 md:h-6 md:w-6"
                strokeWidth={3}
              />
            </button>

            <button
              onClick={() => handleNav('right')}
              disabled={activeIndex === services.length - 1}
              className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-3 border-black bg-[#FF9E00] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none md:h-14 md:w-14"
              aria-label="Scroll Right"
            >
              <ArrowRight
                className="h-5 w-5 text-black transition-transform group-hover:translate-x-1 md:h-6 md:w-6"
                strokeWidth={3}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
