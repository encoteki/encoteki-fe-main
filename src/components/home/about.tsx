'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BrutalismButton } from '@/ui/buttons'

const whitePaperUrl = process.env.NEXT_PUBLIC_WHITEPAPER_URL ?? ''

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null)

  const aboutCardRef = useRef<HTMLDivElement>(null)
  const leftCardRef = useRef<HTMLDivElement>(null)
  const rightCardRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
      if (prefersReduced) return

      const mm = gsap.matchMedia()

      // Desktop (>= XL / 1280px)
      mm.add('(min-width: 1280px)', () => {
        gsap.set(
          [leftCardRef.current, rightCardRef.current, aboutCardRef.current],
          { clearProps: 'all' },
        )

        gsap.set([leftCardRef.current, rightCardRef.current], {
          xPercent: 0,
          rotation: 0,
          autoAlpha: 1,
        })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            end: 'center center',
            scrub: 1,
          },
        })

        tl.to(leftCardRef.current, {
          xPercent: -120,
          rotation: -5,
          ease: 'power2.out',
          duration: 1.5,
        }).to(
          rightCardRef.current,
          {
            xPercent: 120,
            rotation: 5,
            ease: 'power2.out',
            duration: 1.5,
          },
          '<',
        )
      })

      // Mobile & Tab (< XL / 1279px)
      mm.add('(max-width: 1279px)', () => {
        gsap.set(
          [leftCardRef.current, rightCardRef.current, aboutCardRef.current],
          { clearProps: 'all' },
        )

        gsap.from(rightCardRef.current, {
          scrollTrigger: {
            trigger: rightCardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          xPercent: -100,
          rotation: -8,
          duration: 1,
          ease: 'power3.out',
        })

        gsap.from(leftCardRef.current, {
          scrollTrigger: {
            trigger: leftCardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          xPercent: 100,
          rotation: 8,
          duration: 1,
          ease: 'power3.out',
        })
      })
    },
    { scope: containerRef },
  )

  const cardDimensions =
    'h-[500px] w-full max-w-sm rounded-[2.5rem] border-3 border-[var(--primary-black)] overflow-hidden'

  const textStyle =
    'mt-6 flex flex-col space-y-4 font-mono text-xs leading-relaxed font-medium text-(--primary-black)/90 sm:text-sm md:text-base'

  return (
    <section className="home-container flex flex-col items-center justify-center gap-12 overflow-hidden bg-(--khaki-90) md:gap-16">
      <div
        ref={containerRef}
        className="relative flex w-full max-w-360 flex-col items-center justify-center gap-12 xl:block xl:h-150 xl:gap-0"
      >
        {/* About */}
        <div
          ref={aboutCardRef}
          className={`${cardDimensions} relative z-0 flex flex-col justify-between bg-[#FFD94A] p-8 xl:absolute xl:right-0 xl:left-0 xl:mx-auto`}
        >
          <div className="flex flex-col">
            <h2 className="text-5xl leading-[0.9] font-black text-(--primary-black) uppercase md:text-6xl">
              About
            </h2>
            <div className={textStyle}>
              <p>
                ENCOTEKI is a combination of &apos;EN&apos; (Environment),
                &apos;CO&apos; (Community), and &apos;TEKI&apos; (Teman Kita,
                meaning &apos;our friend&apos; in Bahasa).
              </p>
              <p>
                The name reflects our belief that both the environment and
                community are our friends, making them the core of ENCOTEKI.
              </p>
            </div>
          </div>
          <BrutalismButton label="Read Our Plan" href={whitePaperUrl} />
        </div>

        {/* Vision */}
        <div
          ref={rightCardRef}
          className={`${cardDimensions} relative z-10 flex flex-col justify-between bg-[#60A5FA] p-8 xl:absolute xl:right-0 xl:left-0 xl:mx-auto`}
        >
          <div className="flex flex-col">
            <h2 className="text-5xl leading-[0.9] font-black text-(--primary-black) uppercase md:text-6xl">
              Vision
            </h2>
            <div className={textStyle}>
              <p>
                Develop a self-sustainable environment and community through
                technology.
              </p>
              <p>
                Creating a future where wildlife conservation and blockchain
                innovation go hand in hand.
              </p>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div
          ref={leftCardRef}
          className={`${cardDimensions} relative z-20 flex flex-col justify-between bg-[#FF9E00] p-8 xl:absolute xl:right-0 xl:left-0 xl:mx-auto`}
        >
          <div className="flex flex-col">
            <h2 className="text-5xl leading-[0.9] font-black text-(--primary-black) uppercase md:text-6xl">
              Mission
            </h2>
            <div className={textStyle}>
              <p>
                Conserve endangered Indonesian animals through real contribution
                and action.
              </p>
              <p>
                Benefit environment, community, and holders through value-added
                initiatives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
