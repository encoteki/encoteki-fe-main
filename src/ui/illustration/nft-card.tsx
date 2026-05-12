'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export const NFTCardIllustration = () => {
  const cardRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
      if (prefersReduced) return

      gsap.to(cardRef.current, {
        rotation: -3,
        duration: 2,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      })
    },
    { scope: cardRef },
  )

  return (
    <div className="relative flex h-24 w-24 scale-75 items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-90 sm:h-28 sm:w-28 md:h-32 md:w-32 md:scale-75 md:group-hover:scale-90 xl:scale-90 xl:group-hover:scale-105">
      <div
        ref={cardRef}
        className="relative z-10 flex h-28 w-20 -rotate-6 flex-col overflow-hidden rounded-md border-2 border-(--primary-black) bg-(--khaki-99) shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform group-hover:scale-105 sm:h-36 sm:w-28 sm:rounded-xl sm:shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] md:h-42 md:w-28 md:shadow-[6px_6px_0px_0px_rgba(26,26,26,1)]"
      >
        {/* Art Area */}
        <div className="relative flex h-3/5 w-full items-center justify-center border-b-2 border-(--primary-black) bg-(--green-50)">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-(--primary-black) bg-white sm:h-8 sm:w-8 md:h-12 md:w-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 scale-0 transform text-white opacity-0 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-100 group-hover:opacity-100 sm:h-4 sm:w-4 md:h-6 md:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-1 flex-col justify-center gap-1 px-1.5 sm:gap-1.5 sm:px-2 md:gap-2 md:px-3">
          <div className="h-1 w-8 rounded-full bg-(--primary-black) sm:h-1.5 sm:w-10 md:h-2 md:w-16"></div>
          <div className="h-0.5 w-5 rounded-full bg-(--neutral-60) sm:h-1 sm:w-6 md:h-1.5 md:w-10"></div>
          <div className="mt-0.5 flex items-center justify-between sm:mt-1">
            <span className="text-[10px] font-bold text-(--primary-black) sm:text-[11px] md:text-sm">
              #1024
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
