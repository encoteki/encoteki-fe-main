'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export const ChainIllustration = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
      if (prefersReduced) return

      gsap.to(containerRef.current, {
        rotation: 360,
        duration: 40,
        ease: 'none',
        repeat: -1,
      })
    },
    { scope: containerRef },
  )

  return (
    <div className="relative flex h-24 w-24 scale-75 items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-90 sm:h-28 sm:w-28 md:h-32 md:w-32 md:scale-75 md:group-hover:scale-90 xl:scale-90 xl:group-hover:scale-105">
      <div
        ref={containerRef}
        className="relative h-full w-full will-change-transform"
      >
        <div className="absolute top-4 left-2 z-10 flex h-10 w-16 -rotate-45 items-center justify-center rounded-full border-2 border-(--primary-black) bg-[#A855F7] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-3 group-hover:translate-y-3 sm:h-12 sm:w-20">
          <div className="h-4 w-10 rounded-full border-2 border-(--primary-black) bg-white"></div>
        </div>

        <div className="absolute right-2 bottom-4 z-0 flex h-10 w-16 -rotate-45 items-center justify-center rounded-full border-2 border-(--primary-black) bg-[#ccf281] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-x-3 group-hover:-translate-y-3 sm:h-12 sm:w-20">
          <div className="h-4 w-10 rounded-full border-2 border-(--primary-black) bg-white"></div>
        </div>
      </div>
    </div>
  )
}
