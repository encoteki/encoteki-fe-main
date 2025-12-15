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
      'NFTs (non-fungible tokens) are unique cryptographic tokens that exist on a blockchain and cannot be replicated. NFTs represent real-world objects like real estate and artwork, or digital objects like graphic art, videos, and music. With NFTs, people can buy, sell, and trade their assets more efficiently while reducing the probability of fraud. NFTs also have utilities that include things like a digital asset, a service, membership, access to specific events, and any other advantages, depending on the creator.',
  },
  {
    question: 'What is The Satwas Band NFTs ?',
    answer:
      'The Satwas Band is our first NFTs collection, which consists of 3653 randomly generated art, consisting of 5 endangered Indonesian animals that formed into a music group. The Satwas Band will be generated on Polygon Blockchain. Forty percent of the royalties will be donated to the national park that will be chosen by the holders.',
  },
  {
    question: 'Can The Satwa Band NFTs act as an investment ?',
    answer:
      'Every investment has its own risk and rewards, and so do NFTs. The Satwas Band NFTs and ENCOTEKI itself are not an exception to that. We ourselves place ENCOTEKI as an Impact Investing. As we believe that providing value as much as we can to the environment, community, as well as the holders will also increase the value of The Satwas Band NFTs and ENCOTEKI in return.',
  },
  {
    question: 'How to buy The Satwas Band NFTs ?',
    answer: 'Get whitelisted!',
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
        start: 'top bottom',

        onEnter: (batch) => {
          gsap.to(batch, {
            y: 0,
            autoAlpha: 1,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power3.out',
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
      className="home-container flex w-full flex-col gap-12 bg-sky-50"
    >
      <SectionHeading
        title="FAQ"
        desc="Find quick answers to commonly asked questions about Encoteki"
        align="center"
      />

      <div className="mx-auto grid w-full max-w-3xl gap-4">
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
        'faq-card group cursor-pointer rounded-3xl border border-[#E0E0E0] bg-white px-8 py-4 text-black opacity-0 md:rounded-4xl md:p-8',
        'transition-colors duration-300',
        'hover:border-primary-green hover:text-primary-green',
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'md:"w-3/4 w-fit text-left text-base font-medium duration-300 md:text-xl',
            isOpen && 'text-primary-green',
          )}
        >
          {item.question}
        </span>
        <div className="cursor-pointer">
          <ArrowDownIcon
            className={cn(
              'text-(--primary-green) duration-500',
              isOpen ? 'rotate-180' : 'rotate-0',
            )}
          />
        </div>
      </div>

      <p
        className={cn(
          'overflow-hidden text-justify text-sm font-normal transition-all duration-500 ease-in-out md:text-base',
          isOpen ? 'max-h-96 pt-6' : 'max-h-0 pt-0',
        )}
      >
        {item.answer}
      </p>
    </div>
  )
}
