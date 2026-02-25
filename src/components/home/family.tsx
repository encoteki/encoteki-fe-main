'use client'

import { useRef, useState, useEffect, useCallback, memo } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { BrutalismButton } from '@/ui/buttons'

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

  // INTERSECTION OBSERVER
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

  // GSAP TEXT
  useGSAP(
    () => {
      const targets = gsap.utils.toArray('.family-reveal-text')
      gsap.set(targets, { y: 100, autoAlpha: 0 })
      const tl = gsap.timeline({ paused: true })
      tl.to(targets, {
        y: 0,
        autoAlpha: 1,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.2,
      })
      if (isTextVisible) tl.restart()
      else tl.pause(0)
    },
    { scope: textRef, dependencies: [isTextVisible] },
  )

  // GSAP ORBIT
  useGSAP(
    () => {
      if (!circleRef.current) return
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
    <div
      ref={containerRef}
      className="relative flex w-full flex-col items-center justify-center overflow-hidden border-b-2 border-black bg-[#dceeff] py-16 text-white md:min-h-screen md:py-24"
    >
      {/* --- Orbit Container --- */}
      <div
        ref={circleRef}
        className="absolute top-[85%] left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 will-change-transform md:top-[90%] xl:top-full"
        style={{
          width: radius * 2,
          height: radius * 2,
          borderRadius: '50%',
        }}
      >
        {images.map((src, index) => {
          const rotationAngle = index * angleIncrement

          return (
            <div
              key={index}
              className={`absolute top-1/2 left-1/2 -mt-14 -ml-14 h-28 w-28 origin-center md:-mt-20 md:-ml-20 md:h-40 md:w-40 lg:-mt-22 lg:-ml-22 lg:h-44 lg:w-44 xl:-mt-22 xl:-ml-22 xl:h-44 xl:w-44`}
              style={{
                transform: `rotate(${rotationAngle}deg) translateY(-${radius}px)`,
              }}
            >
              {/* Wrapper */}
              <div className="group h-full w-full p-2 transition-transform duration-300 hover:scale-110">
                <div className="relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] md:rounded-3xl md:border-3 md:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] md:group-hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)]">
                  <Image
                    src={src}
                    alt={`Gallery ${index}`}
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

      {/* --- Gradients --- */}
      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background:
            'linear-gradient(to right, #dceeff 0%, transparent 10%, transparent 90%, #dceeff 100%)',
        }}
      />
      <div className="pointer-events-none absolute bottom-0 z-10 h-3/4 w-full bg-linear-to-t from-[#dceeff] via-[#dceeff] to-transparent" />

      {/* --- Spacer --- */}
      <div className="h-50 bg-transparent md:h-75"></div>

      {/* --- Text Content--- */}
      <div
        ref={textRef}
        className="relative z-30 max-w-4xl px-6 text-center text-black"
      >
        <h1 className="family-reveal-text invisible mb-6 text-4xl font-bold tracking-tight md:text-6xl xl:text-8xl">
          Join the family
        </h1>

        <p className="family-reveal-text invisible mx-auto mb-12 max-w-2xl text-base leading-relaxed text-gray-800 md:mb-20 md:text-xl">
          Our platform is currently in beta and invite-only
          <span className="inline md:block">
            Contact us to join our family of early adopters
          </span>
        </p>

        <div className="family-reveal-text invisible">
          <BrutalismButton
            className="rounded-full bg-white px-8 py-3 text-sm font-medium text-black md:text-base"
            label="Our Family"
            href="/family"
          />
        </div>
      </div>
    </div>
  )
}
