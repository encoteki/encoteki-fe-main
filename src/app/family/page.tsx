'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import FamilyGrid from '@/components/family/family-grid'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP)
}

export default function FamilyPage() {
  const headerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline()
        tl.from('.family-h1', {
          yPercent: 100,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        }).from(
          '.family-desc',
          { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.5',
        )
      })
    },
    { scope: headerRef },
  )

  return (
    <main className="partner-container bg-(--khaki-90)">
      <div className="mx-auto max-w-7xl">
        <header ref={headerRef} className="mb-12 max-w-2xl">
          <div className="overflow-hidden">
            <h1 className="family-h1 text-5xl font-medium text-(--primary-black) md:text-6xl">
              Our Family,{' '}
              <span className="font-serif text-(--neutral-40) italic">
                United.
              </span>
            </h1>
          </div>
          <p className="family-desc mt-6 max-w-xl text-lg leading-relaxed text-(--neutral-30)">
            Communities we trust, building alongside us. Real partnerships, real
            value for holders.
          </p>
        </header>

        <FamilyGrid />
      </div>
    </main>
  )
}
