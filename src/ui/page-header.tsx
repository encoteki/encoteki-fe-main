'use client'

import { useRef, type ReactNode } from 'react'
import gsap, { useGSAP } from '@/lib/gsap'

interface PageHeaderProps {
  heading: ReactNode
  description: string
}

export default function PageHeader({ heading, description }: PageHeaderProps) {
  const headerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline()
        tl.from('.page-header-h1', {
          yPercent: 100,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        }).from(
          '.page-header-desc',
          { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.5',
        )
      })
    },
    { scope: headerRef },
  )

  return (
    <header ref={headerRef} className="mb-12 max-w-2xl">
      <div className="overflow-hidden">
        <h1 className="page-header-h1 text-5xl font-medium text-(--primary-black) md:text-6xl">
          {heading}
        </h1>
      </div>
      <p className="page-header-desc mt-6 max-w-xl text-lg leading-relaxed text-(--neutral-30)">
        {description}
      </p>
    </header>
  )
}
