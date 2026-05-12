'use client'

import { useState, lazy, Suspense, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Encoteki from '@/assets/encoteki.logo.webp'
import { ArrowRight } from 'lucide-react'

const NFTCardIllustration = lazy(() =>
  import('@/ui/illustration/nft-card').then((m) => ({
    default: m.NFTCardIllustration,
  })),
)
const SwitchIllustration = lazy(() =>
  import('@/ui/illustration/switch').then((m) => ({
    default: m.SwitchIllustration,
  })),
)
const DiscountReceiptIllustration = lazy(() =>
  import('@/ui/illustration/discount-receipt').then((m) => ({
    default: m.DiscountReceiptIllustration,
  })),
)
const ChainIllustration = lazy(() =>
  import('@/ui/illustration/chain').then((m) => ({
    default: m.ChainIllustration,
  })),
)

const IllustrationFallback = () => (
  <div className="h-24 w-24 rounded-full bg-white/20" />
)

const features = [
  {
    id: 1,
    title: 'Mint',
    description: 'Own the NFT',
    color: 'bg-[var(--green-90)]',
    href: process.env.NEXT_PUBLIC_APP_MINT,
    isExternal: true,
    Illustration: NFTCardIllustration,
  },
  {
    id: 2,
    title: 'DAO',
    description: 'Vote together',
    color: 'bg-[var(--khaki-80)]',
    href: process.env.NEXT_PUBLIC_APP_DAO,
    isExternal: true,
    Illustration: SwitchIllustration,
  },
  {
    id: 3,
    title: 'Partners',
    description: 'Enjoy offers',
    color: 'bg-[var(--red-90)]',
    href: '/partners',
    isExternal: false,
    Illustration: DiscountReceiptIllustration,
  },
  {
    id: 4,
    title: 'Family',
    description: 'Community Partners',
    color: 'bg-[var(--blue-10)]',
    href: '/family',
    isExternal: false,
    Illustration: ChainIllustration,
  },
]

export default function Header() {
  const [isExpanded, setIsExpanded] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  // Stagger card entrance on expand
  useEffect(() => {
    if (!isExpanded || !navRef.current) return
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReduced) return

    const cards = navRef.current.querySelectorAll<HTMLElement>('.nav-card')
    cards.forEach((card, i) => {
      card.style.opacity = '0'
      card.style.transform = 'translateY(12px)'
      setTimeout(
        () => {
          card.style.transition =
            'opacity 0.4s cubic-bezier(0.25,1,0.5,1), transform 0.4s cubic-bezier(0.25,1,0.5,1)'
          card.style.opacity = '1'
          card.style.transform = 'translateY(0)'
        },
        250 + i * 80,
      )
    })
  }, [isExpanded])

  return (
    <>
      <div
        onClick={() => setIsExpanded(false)}
        className={`fixed inset-0 z-9998 bg-[rgba(26,26,26,0.1)] backdrop-blur-sm transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isExpanded
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      />

      <header
        className={`fixed top-0 right-0 left-0 z-9999 flex flex-col border-b-2 border-(--primary-black) bg-white px-4 transition-[height] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] md:px-6 ${
          isExpanded ? 'h-screen md:h-125 lg:h-100' : 'h-16 md:h-20'
        }`}
      >
        <div className="flex h-16 w-full shrink-0 items-center justify-between md:h-20">
          <Link href="/">
            <Image
              src={Encoteki}
              alt="Home"
              width={190}
              height={150}
              className="h-auto w-12 md:w-12 lg:w-16"
              priority
            />
          </Link>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            aria-expanded={isExpanded}
            className="group flex h-12 w-12 cursor-pointer flex-col items-center justify-center gap-1.5 transition-opacity hover:opacity-70"
          >
            <span
              className={`block h-0.75 w-6 bg-(--primary-black) transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                isExpanded ? 'translate-y-2.25 rotate-45' : ''
              }`}
            />
            <span
              className={`block h-0.75 w-6 bg-(--primary-black) transition-opacity duration-300 ${
                isExpanded ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`block h-0.75 w-6 bg-(--primary-black) transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                isExpanded ? '-translate-y-2.25 -rotate-45' : ''
              }`}
            />
          </button>
        </div>

        <nav
          className={`flex h-full flex-col justify-between pt-4 transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
            isExpanded
              ? 'translate-y-0 opacity-100 delay-200'
              : 'pointer-events-none -translate-y-4 opacity-0 delay-0'
          }`}
        >
          <div
            ref={navRef}
            className="grid h-full w-full grid-cols-1 grid-rows-4 gap-4 overflow-y-auto px-2 pb-24 md:grid-cols-2 md:grid-rows-2 md:overflow-visible md:pb-6 lg:grid-cols-4 lg:grid-rows-1 lg:gap-6"
          >
            {features.map((feature) => (
              <Link
                key={feature.id}
                href={feature.href || '#'}
                target={feature.isExternal ? '_blank' : undefined}
                rel={feature.isExternal ? 'noopener noreferrer' : undefined}
                onClick={() => setIsExpanded(false)}
                className={`nav-card group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border-2 border-(--primary-black) p-5 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] ${feature.color}`}
              >
                <div className="absolute top-1/2 right-3 -translate-y-1/2 lg:inset-0 lg:flex lg:translate-y-0 lg:items-center lg:justify-center">
                  {isExpanded && (
                    <Suspense fallback={<IllustrationFallback />}>
                      <feature.Illustration />
                    </Suspense>
                  )}
                </div>

                <div className="relative z-10 my-auto lg:my-0 lg:mt-auto">
                  <h3 className="text-xl font-black text-(--primary-black) uppercase md:text-2xl">
                    {feature.title}
                  </h3>
                  <div className="flex items-center gap-2 text-(--primary-black)/80">
                    <span className="text-sm font-medium">
                      {feature.description}
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </nav>
      </header>
    </>
  )
}
