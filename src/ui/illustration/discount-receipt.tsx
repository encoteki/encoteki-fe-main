'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export const DiscountReceiptIllustration = () => {
  const coinRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
      if (prefersReduced) return

      gsap.to(coinRef.current, {
        y: -4,
        duration: 1.5,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      })
    },
    { scope: coinRef },
  )

  return (
    <div className="relative h-24 w-24 scale-75 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-90 sm:h-28 sm:w-28 md:h-32 md:w-32 md:scale-75 md:group-hover:scale-90 xl:scale-90 xl:group-hover:scale-105">
      <div className="absolute top-2 left-1/2 z-10 -translate-x-1/2 -rotate-[22.5deg] transform transition-transform duration-300 group-hover:scale-105">
        {/* Receipt that pulls out */}
        <div className="absolute top-0 left-1/2 -z-10 flex w-16 -translate-x-1/2 flex-col items-center rounded-b-md border-2 border-(--primary-black) bg-white transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-y-14 sm:w-20">
          <div className="flex w-full flex-col items-center gap-1 pt-6 pb-2">
            <div className="w-full border-t-2 border-dashed border-(--neutral-60)"></div>
          </div>

          <div className="flex flex-col items-center pb-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="text-2xl font-black text-(--primary-red) sm:text-3xl">
              50%
            </span>

            {/* Barcode */}
            <div className="mt-2 flex gap-0.5 opacity-60">
              <div className="h-3 w-1 bg-(--primary-black)"></div>
              <div className="h-3 w-0.5 bg-(--primary-black)"></div>
              <div className="h-3 w-1.5 bg-(--primary-black)"></div>
              <div className="h-3 w-1 bg-(--primary-black)"></div>
            </div>
          </div>
        </div>

        {/* Card reader */}
        <div className="relative z-20 h-12 w-24 rounded-lg border-2 border-(--primary-black) bg-[#A855F7] shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] sm:h-14 sm:w-28">
          <div className="absolute bottom-0 left-1/2 h-2 w-16 -translate-x-1/2 rounded-t-sm border-x-2 border-t-2 border-(--primary-black) bg-(--primary-black) opacity-20"></div>

          <div className="absolute top-3 left-3 flex gap-2">
            <div className="h-3 w-3 rounded-full border-2 border-(--primary-black) bg-[#ccf281]"></div>
            <div className="h-3 w-3 rounded-full border-2 border-(--primary-black) bg-(--primary-red)"></div>
          </div>

          <div className="absolute top-3 right-3 flex flex-col gap-1">
            <div className="h-1 w-4 rounded-full bg-(--primary-black) opacity-20"></div>
            <div className="h-1 w-4 rounded-full bg-(--primary-black) opacity-20"></div>
          </div>
        </div>

        {/* Floating coin */}
        <div
          ref={coinRef}
          className="absolute top-0 -right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border-2 border-(--primary-black) bg-[#ccf281] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] will-change-transform sm:h-10 sm:w-10"
        >
          <span className="text-sm font-black text-(--primary-black)">$</span>
        </div>
      </div>
    </div>
  )
}
