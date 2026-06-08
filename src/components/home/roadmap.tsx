'use client'

import SectionHeading from '@/ui/heading/section-heading'
import { useRef, useState, useEffect, useCallback } from 'react'
import { AbstractSeparator } from '@/ui/abstract-separator'

const phases = [
  {
    id: 1,
    title: 'Genesis',
    description:
      'Platform deployment, strategic alliances, and the debut of exclusive physical collectibles.',
    color: '#FFD94A',
  },
  {
    id: 2,
    title: 'Expansion',
    description:
      'Enhanced digital utility, local collaborations, and laying the groundwork for subsidiaries.',
    color: '#ccf281',
  },
  {
    id: 3,
    title: 'Impact',
    description:
      'Official launch of subsidiaries and evolved NFT utility, driving tangible change via community projects.',
    color: '#E9D5FF',
  },
  {
    id: 4,
    title: 'Legacy',
    description:
      'Fully immersive Metaverse presence, a specialized educational platform, and full DAO governance.',
    color: '#FF9E00',
  },
]

export default function Roadmap() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const isProgrammaticScroll = useRef(false)
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current !== null) clearTimeout(scrollTimerRef.current)
    }
  }, [])

  const scrollToItem = useCallback(
    (index: number) => {
      const container = scrollContainerRef.current
      const item = itemsRef.current[index]

      if (container && item) {
        const scrollLeft =
          item.offsetLeft - container.clientWidth / 2 + item.clientWidth / 2

        isProgrammaticScroll.current = true
        container.scrollTo({
          left: scrollLeft,
          behavior: reducedMotion ? 'auto' : 'smooth',
        })
        if (scrollTimerRef.current !== null)
          clearTimeout(scrollTimerRef.current)
        scrollTimerRef.current = setTimeout(
          () => {
            isProgrammaticScroll.current = false
          },
          reducedMotion ? 50 : 600,
        )
      }
    },
    [reducedMotion],
  )

  const navigateToIndex = useCallback((index: number) => {
    isProgrammaticScroll.current = true
    setActiveIndex(index)
  }, [])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      if (isProgrammaticScroll.current) return

      const containerCenter = container.scrollLeft + container.clientWidth / 2
      let closestIndex = 0
      let closestDistance = Infinity

      itemsRef.current.forEach((item, index) => {
        if (item) {
          const itemCenter = item.offsetLeft + item.clientWidth / 2
          const distance = Math.abs(itemCenter - containerCenter)
          if (distance < closestDistance) {
            closestDistance = distance
            closestIndex = index
          }
        }
      })

      setActiveIndex(closestIndex)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNav = useCallback(
    (direction: 'left' | 'right') => {
      const newIndex =
        direction === 'left'
          ? Math.max(0, activeIndex - 1)
          : Math.min(phases.length - 1, activeIndex + 1)
      navigateToIndex(newIndex)
    },
    [activeIndex, navigateToIndex],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handleNav('left')
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNav('right')
      }
    },
    [handleNav],
  )

  useEffect(() => {
    scrollToItem(activeIndex)

    // Stamp delight: brief scale pulse on the active card
    if (!reducedMotion) {
      const activeCard = itemsRef.current[activeIndex]?.querySelector(
        '.roadmap-card',
      ) as HTMLElement | null
      if (activeCard) {
        activeCard.style.transform = 'scale(1.15)'
        setTimeout(() => {
          activeCard.style.transform = ''
        }, 200)
      }
    }
  }, [activeIndex, scrollToItem, reducedMotion])

  return (
    <section className="bg-(--green-90) md:min-h-screen">
      <AbstractSeparator className="w-full" fillColor="#f6f6ec" />

      <div className="py-16 md:py-24 lg:py-32">
        <div className="px-4 pb-8 text-center">
          <SectionHeading
            title="Roadmap"
            titleClassName="font-black"
            desc="The blueprint of our sustainable growth ahead."
            align="center"
          />
        </div>

        {/* Carousel */}
        <div
          className="relative"
          role="region"
          aria-label="Roadmap phases"
          aria-roledescription="carousel"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <div
            ref={scrollContainerRef}
            className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-[calc(50%-140px)] py-12 md:gap-8 md:px-[calc(50%-175px)] md:py-16 xl:gap-12 xl:px-[calc(50%-190px)]"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {phases.map((phase, index) => {
              const isActive = index === activeIndex

              return (
                <div
                  key={phase.id}
                  ref={(el) => {
                    itemsRef.current[index] = el
                  }}
                  onClick={() => navigateToIndex(index)}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Phase ${phase.id}: ${phase.title}`}
                  className="group relative flex w-70 shrink-0 cursor-pointer snap-center items-center justify-center md:w-87.5 xl:w-95"
                >
                  <div
                    className={`roadmap-card relative flex min-h-60 w-full flex-col items-center rounded-3xl border-3 border-(--primary-black) bg-white p-6 text-center will-change-transform md:min-h-70 md:rounded-4xl md:p-10 xl:min-h-75 xl:p-12 ${
                      reducedMotion
                        ? ''
                        : 'transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]'
                    } ${
                      isActive
                        ? 'z-10 scale-100 opacity-100 md:scale-110'
                        : 'z-0 scale-90 opacity-50 hover:scale-95 hover:opacity-80'
                    }`}
                  >
                    {/* Phase pill */}
                    <div
                      className={`absolute -top-5 right-6 z-20 -rotate-3 rounded-lg border-2 border-(--primary-black) px-4 py-2 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] md:-top-6 md:right-8 ${reducedMotion ? '' : 'transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:rotate-0'}`}
                      style={{ backgroundColor: phase.color }}
                    >
                      <span className="block text-[10px] font-black tracking-widest text-(--primary-black) uppercase md:text-xs">
                        Phase 0{phase.id}
                      </span>
                    </div>

                    <h3 className="mt-4 mb-3 text-2xl leading-tight font-black tracking-tight text-(--primary-black) uppercase md:mb-4 md:text-3xl xl:mb-5 xl:text-4xl">
                      {phase.title}
                    </h3>

                    <p className="font-mono text-xs leading-relaxed text-(--neutral-30) sm:text-sm md:text-sm">
                      {phase.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Navigation: prev + dots + next in one row */}
          <div className="mt-8 flex items-center justify-center gap-4 md:mt-10 md:gap-5">
            <div className="flex items-center gap-3">
              {phases.map((phase, index) => (
                <button
                  key={index}
                  onClick={() => navigateToIndex(index)}
                  aria-label={`Go to phase ${index + 1}`}
                  className={`h-3 rounded-full border-2 border-(--primary-black) transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    index === activeIndex
                      ? 'w-8 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]'
                      : 'w-3 bg-transparent hover:bg-(--neutral-60)'
                  }`}
                  style={
                    index === activeIndex
                      ? { backgroundColor: phase.color }
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
