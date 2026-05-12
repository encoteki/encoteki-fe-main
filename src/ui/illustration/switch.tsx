'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export const SwitchIllustration = () => {
  const knobRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
      if (prefersReduced) return

      // Subtle idle pulse on the knob
      gsap.to(knobRef.current, {
        scale: 1.05,
        duration: 1.2,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      })
    },
    { scope: knobRef },
  )

  return (
    <div className="relative flex h-24 w-24 scale-75 items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-90 sm:h-28 sm:w-28 md:h-32 md:w-32 md:scale-75 md:group-hover:scale-90 xl:scale-90 xl:group-hover:scale-105">
      {/* Switch track */}
      <div className="relative z-10 flex h-12 w-24 -rotate-6 items-center rounded-full border-2 border-[var(--primary-black)] bg-[var(--primary-red)] shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] transition-colors duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:bg-[#ccf281] sm:h-14 sm:w-28">
        <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-black sm:text-sm">
          <span className="translate-x-1 text-[var(--primary-black)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            YES
          </span>
          <span className="-translate-x-1 text-white opacity-100 transition-opacity duration-300 group-hover:opacity-0">
            NO
          </span>
        </div>

        {/* Knob */}
        <div
          ref={knobRef}
          className="absolute left-1 h-9 w-9 rounded-full border-2 border-[var(--primary-black)] bg-white shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform group-hover:left-[calc(100%-2.5rem)] group-hover:rotate-180 sm:h-11 sm:w-11 sm:group-hover:left-[calc(100%-3rem)]"
        >
          <div className="absolute top-1/2 left-1/2 h-4 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--neutral-60)]"></div>
        </div>
      </div>

      {/* Sparkle burst on hover */}
      <div className="absolute -top-2 -right-2 z-20 scale-0 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-100">
        <div className="relative h-8 w-8">
          <div className="absolute top-0 left-1/2 h-2 w-1 -translate-x-1/2 bg-[var(--primary-black)]"></div>
          <div className="absolute bottom-0 left-1/2 h-2 w-1 -translate-x-1/2 bg-[var(--primary-black)]"></div>
          <div className="absolute top-1/2 left-0 h-1 w-2 -translate-y-1/2 bg-[var(--primary-black)]"></div>
          <div className="absolute top-1/2 right-0 h-1 w-2 -translate-y-1/2 bg-[var(--primary-black)]"></div>
        </div>
      </div>
    </div>
  )
}
