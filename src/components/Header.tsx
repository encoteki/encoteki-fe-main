'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Encoteki from '@/assets/logo.webp'
import { ArrowRight } from 'lucide-react'
import { NFTCardIllustration } from '@/ui/illustration/nft-card'
import { SwitchIllustration } from '@/ui/illustration/switch'
import { DiscountReceiptIllustration } from '@/ui/illustration/discount-receipt'
import { ChainIllustration } from '@/ui/illustration/chain'

const features = [
  {
    id: 1,
    title: 'Mint',
    description: 'Own the NFT',
    color: 'bg-[#dcfce7]',
    href: '/mint',
    illustration: <NFTCardIllustration />,
  },
  {
    id: 2,
    title: 'DAO',
    description: 'Vote together',
    color: 'bg-[#ede9fe]',
    href: '/dao',
    illustration: <SwitchIllustration />,
  },
  {
    id: 3,
    title: 'Partner Deals',
    description: 'Enjoy offers',
    color: 'bg-[#fee2e2]',
    href: '/partners',
    illustration: <DiscountReceiptIllustration />,
  },
  {
    id: 4,
    title: 'Family',
    description: 'Community Partners',
    color: 'bg-[#f3f4f6]',
    href: '/family',
    illustration: <ChainIllustration />,
  },
]

export default function Header() {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleMenu = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-9999 flex flex-col border-b-2 border-black bg-white px-4 transition-[height] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] md:px-6 ${
        isExpanded ? 'h-screen md:h-[500px] lg:h-[400px]' : 'h-16 md:h-20'
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
          onClick={toggleMenu}
          aria-label="Toggle Menu"
          className="group flex h-12 w-12 flex-col items-center justify-center gap-1.5 transition-opacity hover:opacity-70"
        >
          <span
            className={`block h-[3px] w-6 bg-black transition-transform duration-300 ease-in-out ${
              isExpanded ? 'translate-y-[9px] rotate-45' : ''
            }`}
          />
          <span
            className={`block h-[3px] w-6 bg-black transition-opacity duration-300 ease-in-out ${
              isExpanded ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`block h-[3px] w-6 bg-black transition-transform duration-300 ease-in-out ${
              isExpanded ? '-translate-y-[9px] -rotate-45' : ''
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
          className={`grid h-full w-full grid-cols-1 grid-rows-4 gap-4 overflow-y-auto px-2 pb-24 md:grid-cols-2 md:grid-rows-2 md:overflow-visible md:pb-6 lg:grid-cols-4 lg:grid-rows-1 lg:gap-6`}
        >
          {features.map((feature) => (
            <Link
              key={feature.id}
              href={feature.href}
              onClick={() => setIsExpanded(false)}
              className={`group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${feature.color}`}
            >
              <div className="absolute top-1/2 right-3 -translate-y-1/2 lg:inset-0 lg:flex lg:translate-y-0 lg:items-center lg:justify-center">
                {feature.illustration ? (
                  feature.illustration
                ) : (
                  <div className="h-24 w-24 rounded-full bg-white/20 blur-2xl" />
                )}
              </div>

              <div className="relative z-10 my-auto lg:my-0 lg:mt-auto">
                <h3 className="text-xl font-bold text-black drop-shadow-sm md:text-2xl">
                  {feature.title}
                </h3>
                <div className="flex items-center gap-2 text-black/80">
                  <span className="text-sm font-medium">
                    {feature.description}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
