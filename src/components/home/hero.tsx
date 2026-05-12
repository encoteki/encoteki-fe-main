'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import TextMarquee from '@/ui/text-marquee'
import Image, { StaticImageData } from 'next/image'
import { getMarqueeTexts } from '@/lib/marquee-config'

import Base from '@/assets/chains/base.jpeg'
import Arbitrum from '@/assets/chains/arbitrum.svg'
import Lisk from '@/assets/chains/lisk.webp'
import Manta from '@/assets/chains/manta.png'

export default function Hero() {
  const { texts, separators } = getMarqueeTexts()

  const chainIcons: Record<string, { src: StaticImageData | string }> = {
    base: { src: Base },
    arbitrum: { src: Arbitrum },
    lisk: { src: Lisk },
    manta: { src: Manta },
  }

  const marqueeTexts = texts.map((text) => {
    const lowerText = text.toLowerCase()
    for (const [chainKey, iconData] of Object.entries(chainIcons)) {
      if (lowerText.includes(chainKey)) {
        return { text, icon: <MarqueeIcon src={iconData.src} /> }
      }
    }
    return { text }
  })

  return (
    <section className="relative flex min-h-screen w-full flex-col overflow-hidden bg-(--red-90) pt-16 md:pt-20">
      {/* Marquee strip */}
      <div className="w-full shrink-0 border-b-2 border-(--primary-black) bg-(--red-90) py-2 md:py-3">
        <TextMarquee
          texts={marqueeTexts}
          separator={separators}
          className="text-xs font-medium tracking-wider uppercase sm:text-sm md:text-base lg:text-lg"
          speed={125}
          repeat={6}
          label="Encoteki is live on multiple blockchain networks"
        />
      </div>

      {/* Hero content */}
      <div className="flex w-full flex-1 items-end bg-linear-to-b from-(--blue-10) to-(--khaki-90) px-4 pb-12 sm:px-6 sm:pb-16 md:items-center md:px-12 lg:px-20">
        <HeroHeadline />
      </div>
    </section>
  )
}

function HeroHeadline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const h1Ref = useRef<HTMLHeadingElement>(null)
  const accentRef = useRef<HTMLSpanElement>(null)
  const isEnteredRef = useRef(false)

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
      if (prefersReduced) return

      const lines =
        containerRef.current?.querySelectorAll<HTMLElement>('.hero-line')
      if (!lines?.length) return

      gsap.set(lines, { yPercent: 120, opacity: 0 })
      gsap.to(lines, {
        yPercent: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.3,
        onComplete: () => {
          isEnteredRef.current = true
        },
      })

      // Subtle color pulse on "confidence."
      if (accentRef.current) {
        gsap.to(accentRef.current, {
          color: 'var(--primary-green)',
          duration: 1.8,
          delay: 2,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: 1,
        })
      }
    },
    { scope: containerRef },
  )

  // Cursor-reactive ink bleed (quieted)
  useEffect(() => {
    const container = containerRef.current
    const h1 = h1Ref.current
    if (!container || !h1) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
    if (prefersReduced || isTouchDevice) return

    let rafId: number | null = null
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      currentX = lerp(currentX, targetX, 0.1)
      currentY = lerp(currentY, targetY, 0.1)

      const shadowX = (currentX * 1.5).toFixed(1)
      const shadowY = (currentY * 1).toFixed(1)
      const blur = ((Math.abs(currentX) + Math.abs(currentY)) * 0.8).toFixed(1)

      h1.style.textShadow = `${shadowX}px ${shadowY}px ${blur}px rgba(26,26,26,0.15)`
      rafId = requestAnimationFrame(tick)
    }

    const handleMove = (e: PointerEvent) => {
      if (!isEnteredRef.current) return
      const rect = container.getBoundingClientRect()
      targetX = (e.clientX - rect.left) / rect.width - 0.5
      targetY = (e.clientY - rect.top) / rect.height - 0.5
    }

    const handleLeave = () => {
      targetX = 0
      targetY = 0
    }

    rafId = requestAnimationFrame(tick)
    container.addEventListener('pointermove', handleMove)
    container.addEventListener('pointerleave', handleLeave)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      container.removeEventListener('pointermove', handleMove)
      container.removeEventListener('pointerleave', handleLeave)
      h1.style.textShadow = ''
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full max-w-300">
      <h1
        ref={h1Ref}
        className="text-[clamp(2.5rem,9vw,7.5rem)] leading-[0.95] font-bold tracking-[-0.02em] text-(--primary-black) uppercase"
      >
        <span className="hero-line block overflow-hidden">
          <span className="block pb-[0.15em]">A community</span>
        </span>
        <span className="hero-line block overflow-hidden">
          <span className="block pb-[0.15em]">building wildlife</span>
        </span>
        <span className="hero-line block overflow-hidden">
          <span className="block pb-[0.15em]">
            <span
              ref={accentRef}
              className="text-[0.9em] tracking-[0.005em] text-(--primary-green) italic"
            >
              confidence.
            </span>
          </span>
        </span>
      </h1>
    </div>
  )
}

const MarqueeIcon = ({ src }: { src: StaticImageData | string }) => {
  return (
    <div className="relative flex h-5 w-5 shrink-0 items-center justify-center sm:h-6 sm:w-6 md:h-8 md:w-8">
      <Image
        src={src}
        alt=""
        fill
        className="rounded-md object-contain"
        sizes="32px"
      />
    </div>
  )
}
