'use client'

import { useState, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import SectionHeading from '@/ui/text/SectionHeading'

interface FAQItemData {
  question: string
  answer: string
}

interface FAQItemProps {
  item: FAQItemData
  isOpen: boolean
  onClick: () => void
}

const FAQ_DATA: FAQItemData[] = [
  {
    question: 'What is NFT ?',
    answer:
      'NFTs (non-fungible tokens) are unique cryptographic tokens that exist on a blockchain and cannot be replicated. NFTs represent real-world objects like real estate and artwork, or digital objects like graphic art, videos, and music. With NFTs, people can buy, sell, and trade their assets more efficiently while reducing the probability of fraud.',
  },
  {
    question: 'What is The Satwas Band NFTs ?',
    answer:
      'The Satwas Band is our first NFTs collection, which consists of 3653 randomly generated art, consisting of 5 endangered Indonesian animals that formed into a music group. The Satwas Band will be generated on Polygon Blockchain.',
  },
  {
    question: 'Can The Satwa Band NFTs act as an investment ?',
    answer:
      'Every investment has its own risk and rewards, and so do NFTs. The Satwas Band NFTs and ENCOTEKI itself are not an exception to that. We ourselves place ENCOTEKI as an Impact Investing. As we believe that providing value as much as we can to the environment will return value to holders.',
  },
  {
    question: 'How to buy The Satwas Band NFTs ?',
    answer: 'Get whitelisted! Join our Discord for more information.',
  },
]

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export default function FAQ() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null)

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('.faq-card')
      const scroller = document.querySelector('.scrollable-content')

      gsap.set(cards, { y: 100, autoAlpha: 0 })

      ScrollTrigger.batch(cards, {
        scroller: scroller || window,
        start: 'top 85%',

        onEnter: (batch) => {
          gsap.to(batch, {
            y: 0,
            autoAlpha: 1,
            stagger: 0.15,
            duration: 0.8,
            ease: 'back.out(1.2)',
            overwrite: true,
          })
        },
        onLeaveBack: (batch) => {
          gsap.to(batch, {
            y: 100,
            autoAlpha: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power3.in',
            overwrite: true,
          })
        },
      })
    },
    { scope: containerRef },
  )

  const handleToggle = (index: number) => {
    setVisibleIndex(visibleIndex === index ? null : index)
  }

  return (
    <section
      id="faq"
      ref={containerRef}
      className="home-container flex w-full flex-col gap-12 bg-[#F3F4F6] py-16 md:py-24"
    >
      <SectionHeading
        title="FAQ"
        desc="Find quick answers to commonly asked questions about Encoteki"
        align="center"
        className="text-4xl font-black md:text-6xl"
      />

      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {FAQ_DATA.map((item, index) => (
          <FAQItem
            key={index}
            item={item}
            isOpen={visibleIndex === index}
            onClick={() => handleToggle(index)}
          />
        ))}
      </div>
    </section>
  )
}

const FAQItem = ({ item, isOpen, onClick }: FAQItemProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        // Base Layout & GSAP Prep
        'faq-card group relative cursor-pointer opacity-0',
        'flex flex-col justify-center',
        // Borders & Shape
        'rounded-4xl border-2 border-black bg-white p-6 md:rounded-[2.5rem] md:p-8',
        // Hover Effects
        'transition-all duration-300 ease-out',
        // Active State Styling
        isOpen && 'border-black bg-white',
      )}
    >
      {/* --- Question & Icon --- */}
      <div className="flex items-center justify-between gap-4">
        <h3
          className={cn(
            'text-base leading-tight font-medium text-black transition-colors duration-300 md:text-2xl',
          )}
        >
          {item.question}
        </h3>

        {/* Icon Wrapper */}
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-black transition-all duration-300 md:h-12 md:w-12',
            isOpen
              ? 'rotate-180 bg-(--primary-green) text-white'
              : 'bg-white text-black group-hover:bg-(--primary-green) group-hover:text-white',
          )}
        >
          <ArrowDownIcon strokeWidth={3} className="h-5 w-5 md:h-6 md:w-6" />
        </div>
      </div>

      {/* --- Content Answer --- */}
      <div
        className={cn(
          'grid overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]',
          isOpen
            ? 'grid-rows-[1fr] pt-4 opacity-100 md:pt-6'
            : 'grid-rows-[0fr] pt-0 opacity-0',
        )}
      >
        <div className="min-h-0">
          <p className="font-mono text-sm leading-relaxed font-medium text-gray-700 md:text-base md:leading-loose">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  )
}
