'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import PartnersGrid from '@/components/partners/partners-grid'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP)
}

export default function PartnerDealsPage() {
  const headerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline()
        tl.from('.partners-h1', {
          yPercent: 100,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        }).from(
          '.partners-desc',
          { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.5',
        )
      })
    },
    { scope: headerRef },
  )

  return (
    <main className="partner-container bg-(--khaki-90)">
      <header ref={headerRef} className="mb-12 max-w-2xl">
        <div className="overflow-hidden">
          <h1 className="partners-h1 text-5xl font-medium text-(--primary-black) md:text-6xl">
            Partner Deals,{' '}
            <span className="font-serif text-(--neutral-40) italic">
              Curated.
            </span>
          </h1>
        </div>
        <p className="partners-desc mt-6 max-w-xl text-lg leading-relaxed text-(--neutral-30)">
          Exclusive perks for Encoteki holders. Real discounts, real partners,
          no fluff.
        </p>
      </header>

      <PartnersGrid />
    </main>
  )
}
