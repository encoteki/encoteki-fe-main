'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { BrutalismButton } from '@/ui/buttons'
import { AbstractSeparator } from '@/ui/abstract-separator'

// Image
import Bittime from '@/assets/families/bittime.webp'
import Blockplay from '@/assets/families/blockplay.webp'
import Codefest from '@/assets/families/codefest.webp'
import CryptoExist from '@/assets/families/cryptoexist.webp'
import CryptoGalaxy from '@/assets/families/cryptogalaxy.webp'
import DEX from '@/assets/families/dex.webp'
import FutureCoin from '@/assets/families/futurecoin.webp'
import IDNFT from '@/assets/families/idnft.webp'
import Lisk from '@/assets/families/lisk.webp'
import Manta from '@/assets/families/manta.webp'
import Viction from '@/assets/families/viction.webp'

const images = [
  Bittime,
  Blockplay,
  Codefest,
  CryptoExist,
  CryptoGalaxy,
  DEX,
  FutureCoin,
  IDNFT,
  Lisk,
  Manta,
  Viction,
]

export default function FamilyGallery() {
  const containerRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [isTextVisible, setIsTextVisible] = useState(false)

  const [radius, setRadius] = useState(800)

  const updateRadius = useCallback(() => {
    const width = window.innerWidth
    if (width < 768) setRadius(340)
    else if (width < 1024) setRadius(600)
    else if (width < 1280) setRadius(700)
    else setRadius(800)
  }, [])

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>
    timeoutId = setTimeout(updateRadius, 0)

    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateRadius, 150)
    }

    window.addEventListener('resize', handleResize, { passive: true })
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
    }
  }, [updateRadius])

  useEffect(() => {
    const element = textRef.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsTextVisible(entry.isIntersecting),
      { threshold: 0.1 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
      if (prefersReduced) {
        gsap.set('.family-reveal-text', { autoAlpha: 1, y: 0 })
        return
      }

      const targets = gsap.utils.toArray('.family-reveal-text')
      gsap.set(targets, { y: 60, autoAlpha: 0 })
      const tl = gsap.timeline({ paused: true })
      tl.to(targets, {
        y: 0,
        autoAlpha: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.2,
      })
      if (isTextVisible) tl.restart()
      else tl.pause(0)
    },
    { scope: textRef, dependencies: [isTextVisible] },
  )

  useGSAP(
    () => {
      if (!circleRef.current) return
      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
      if (prefersReduced) return

      gsap.to(circleRef.current, {
        rotation: 360,
        duration: 50,
        repeat: -1,
        ease: 'linear',
      })
    },
    { scope: containerRef },
  )

  const angleIncrement = 360 / images.length

  return (
    <>
      <div className="bg-(--blue-10)">
        <AbstractSeparator fillColor="#f0faf3" />
      </div>

      <div
        ref={containerRef}
        className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-(--blue-10) py-16 md:min-h-screen md:py-24"
      >
        {/* Orbit */}
        <div
          ref={circleRef}
          className="absolute top-[85%] left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 will-change-transform md:top-[90%] xl:top-full"
          style={{
            width: radius * 2,
            height: radius * 2,
            borderRadius: '50%',
          }}
          aria-hidden="true"
        >
          {images.map((src, index) => {
            const rotationAngle = index * angleIncrement

            return (
              <div
                key={index}
                className="absolute top-1/2 left-1/2 -mt-14 -ml-14 h-28 w-28 origin-center md:-mt-20 md:-ml-20 md:h-40 md:w-40 lg:-mt-22 lg:-ml-22 lg:h-44 lg:w-44 xl:-mt-22 xl:-ml-22 xl:h-44 xl:w-44"
                style={{
                  transform: `rotate(${rotationAngle}deg) translateY(-${radius}px)`,
                }}
              >
                <div className="group h-full w-full p-2 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-110">
                  <div className="relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-(--primary-black) bg-white shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[5px_5px_0px_0px_rgba(26,26,26,1)] md:rounded-3xl md:border-3 md:shadow-[5px_5px_0px_0px_rgba(26,26,26,1)] md:group-hover:shadow-[7px_7px_0px_0px_rgba(26,26,26,1)]">
                    <Image
                      src={src}
                      alt=""
                      className="pointer-events-none object-contain object-center p-3 md:p-5"
                      sizes="(max-width: 768px) 120px, (max-width: 1280px) 180px, 200px"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Edge gradients */}
        <div
          className="pointer-events-none absolute inset-0 z-20"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(to right, var(--blue-10) 0%, transparent 10%, transparent 90%, var(--blue-10) 100%)',
          }}
        />
        <div className="pointer-events-none absolute bottom-0 z-10 h-3/4 w-full bg-linear-to-t from-(--blue-10) via-(--blue-10) to-transparent" />

        {/* Spacer */}
        <div className="h-50 md:h-75" />

        {/* Text */}
        <div ref={textRef} className="relative z-30 max-w-4xl px-6 text-center">
          <h2 className="family-reveal-text invisible mb-6 text-5xl font-black tracking-tight text-(--primary-black) md:text-7xl xl:text-8xl">
            Join the family
          </h2>

          <p className="family-reveal-text invisible mx-auto mb-12 max-w-2xl text-base leading-relaxed text-(--neutral-30) md:mb-20 md:text-xl">
            We&apos;re building in the open with communities who care about
            conservation. Come say hello.
          </p>

          <div className="family-reveal-text invisible">
            <BrutalismButton label="Our Family" href="/family" />
          </div>
        </div>
      </div>
    </>
  )
}
