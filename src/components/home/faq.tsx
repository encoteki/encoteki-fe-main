'use client'

import { useState, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import SectionHeading from '@/ui/heading/section-heading'
import { AbstractSeparator } from '@/ui/abstract-separator'
import posthog from 'posthog-js'

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
    question: 'What is NFT?',
    answer:
      'NFTs (non-fungible tokens) are unique cryptographic tokens that exist on a blockchain and cannot be replicated. NFTs represent real-world objects like real estate and artwork, or digital objects like graphic art, videos, and music. With NFTs, people can buy, sell, and trade their assets more efficiently while reducing the probability of fraud.',
  },
  {
    question: 'What is The Satwas Band NFTs?',
    answer:
      'The Satwas Band is our first NFTs collection, which consists of 3653 randomly generated art, consisting of 5 endangered Indonesian animals that formed into a music group. The Satwas Band will be generated on Polygon Blockchain.',
  },
  {
    question: 'Can The Satwas Band NFTs act as an investment?',
    answer:
      'Every investment has its own risk and rewards, and so do NFTs. The Satwas Band NFTs and ENCOTEKI itself are not an exception to that. We ourselves place ENCOTEKI as an Impact Investing. As we believe that providing value as much as we can to the environment will return value to holders.',
  },
  {
    question: 'How to buy The Satwas Band NFTs?',
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
      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

      const cards = gsap.utils.toArray<HTMLElement>('.faq-card')

      if (prefersReduced) {
        gsap.set(cards, { autoAlpha: 1, y: 0 })
        return
      }

      gsap.set(cards, { y: 60, autoAlpha: 0 })

      ScrollTrigger.batch(cards, {
        start: 'top 85%',
        onEnter: (batch) => {
          gsap.to(batch, {
            y: 0,
            autoAlpha: 1,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power3.out',
            overwrite: true,
          })
        },
        onLeaveBack: (batch) => {
          gsap.to(batch, {
            y: 60,
            autoAlpha: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: 'power3.in',
            overwrite: true,
          })
        },
      })
    },
    { scope: containerRef },
  )

  const handleToggle = (index: number) => {
    const isOpening = visibleIndex !== index
    setVisibleIndex(isOpening ? index : null)
    posthog.capture('faq_question_toggled', {
      question: FAQ_DATA[index].question,
      action: isOpening ? 'opened' : 'closed',
    })
  }

  return (
    <>
      <div className="bg-(--khaki-80)">
        <AbstractSeparator fillColor="#ceeefd" />
      </div>

      <section
        id="faq"
        ref={containerRef}
        className="home-container flex w-full flex-col gap-12 bg-(--khaki-80) py-16 md:py-24"
      >
        <SectionHeading
          title="FAQ"
          titleClassName="font-black"
          desc="Everything you need to know before joining the community."
          align="center"
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
    </>
  )
}

const FAQItem = ({ item, isOpen, onClick }: FAQItemProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      className={cn(
        'faq-card group relative cursor-pointer opacity-0',
        'flex w-full flex-col justify-center text-left',
        'rounded-4xl border-2 border-(--primary-black) bg-white p-6 md:rounded-[2.5rem] md:p-8',
        'transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]',
        'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--primary-black)',
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-base leading-tight font-medium text-(--primary-black) transition-colors duration-300 md:text-2xl">
          {item.question}
        </span>

        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 md:h-12 md:w-12',
            isOpen
              ? 'rotate-180 bg-(--primary-green) text-white'
              : 'bg-white text-(--primary-black) group-hover:text-(--primary-green)',
          )}
        >
          <ArrowDownIcon strokeWidth={3} className="h-5 w-5 md:h-6 md:w-6" />
        </div>
      </div>

      <div
        className={cn(
          'grid overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]',
          isOpen
            ? 'grid-rows-[1fr] pt-4 opacity-100 md:pt-6'
            : 'grid-rows-[0fr] pt-0 opacity-0',
        )}
      >
        <div className="min-h-0">
          <p className="font-mono text-sm leading-relaxed font-medium text-(--neutral-30) md:text-base md:leading-loose">
            {item.answer}
          </p>
        </div>
      </div>
    </button>
  )
}
