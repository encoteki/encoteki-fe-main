'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import Button from '@/ui/Button'

// Image
import Bittime from '@/assets/family/Bittime.webp'
import Blockplay from '@/assets/family/Blockplay.webp'
import Codefest from '@/assets/family/Codefest.webp'
import CryptoExist from '@/assets/family/CryptoExist.webp'
import CryptoGalaxy from '@/assets/family/CryptoGalaxy.webp'
import Cryptorize from '@/assets/family/Cryptorize.webp'
import DEX from '@/assets/family/DigitalExchangeIndonesia.webp'
import FutureCoin from '@/assets/family/FutureCoin.webp'
import IDNFT from '@/assets/family/IDNFT.webp'
import Lisk from '@/assets/family/Lisk.webp'
import Manta from '@/assets/family/MantaNetwork.webp'
import OdenCircle from '@/assets/family/OdenCircle.webp'
import W3W from '@/assets/family/Web3Week.webp'

const images = [
  Bittime,
  Blockplay,
  Codefest,
  CryptoExist,
  CryptoGalaxy,
  Cryptorize,
  DEX,
  FutureCoin,
  IDNFT,
  Lisk,
  Manta,
  OdenCircle,
  W3W,
]

export default function FamilyGallery() {
  const containerRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [isTextVisible, setIsTextVisible] = useState(false)

  const [radius, setRadius] = useState(800)

  // --- 1. RESPONSIVE LOGIC ---
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 768) {
        setRadius(340)
      } else if (width < 1280) {
        setRadius(600)
      } else {
        setRadius(800)
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // --- 2. INTERSECTION OBSERVER ---
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

  // --- 3. GSAP TEXT ---
  useGSAP(
    () => {
      const targets = gsap.utils.toArray('.reveal-text')
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

  // --- 4. GSAP ORBIT ---
  useGSAP(
    () => {
      if (!circleRef.current) return
      gsap.to(circleRef.current, {
        rotation: 360,
        duration: 120,
        repeat: -1,
        ease: 'linear',
      })
    },
    { scope: containerRef },
  )

  const totalItems = images.length
  const angleIncrement = 360 / totalItems

  return (
    <div
      ref={containerRef}
      className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-black py-16 text-white md:min-h-screen md:py-24"
    >
      {/* --- Orbit Container --- */}
      <div
        ref={circleRef}
        className="absolute top-[85%] left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 md:top-[90%] xl:top-full"
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
              className={`absolute top-1/2 left-1/2 -mt-10 -ml-10 h-20 w-20 origin-center md:-mt-16 md:-ml-16 md:h-32 md:w-32 xl:-mt-22 xl:-ml-22 xl:h-44 xl:w-44`}
              style={{
                transform: `rotate(${rotationAngle}deg) translateY(-${radius}px)`,
              }}
            >
              <div className="h-full w-full p-2 transition-transform duration-300 hover:scale-110">
                <div className="relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white p-2 shadow-2xl backdrop-blur-sm md:rounded-2xl md:p-4">
                  <Image
                    src={src}
                    alt={`Gallery ${index}`}
                    className="pointer-events-none object-cover object-center"
                    sizes="(max-width: 768px) 100px, (max-width: 1280px) 150px, 200px"
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
            'linear-gradient(to right, black 0%, transparent 10%, transparent 90%, black 100%)',
        }}
      />
      <div className="pointer-events-none absolute bottom-0 z-10 h-3/4 w-full bg-linear-to-t from-black via-black/80 to-transparent" />

      {/* --- Spacer Responsif --- */}
      <div className="h-[200px] bg-transparent md:h-[300px]"></div>

      {/* --- TEXT CONTENT --- */}
      <div ref={textRef} className="relative z-30 max-w-4xl px-6 text-center">
        <h1 className="reveal-text invisible mb-6 text-4xl font-bold tracking-tight md:text-6xl xl:text-8xl">
          Join the family
        </h1>

        <p className="reveal-text invisible mx-auto mb-12 max-w-2xl text-base leading-relaxed text-gray-400 md:mb-20 md:text-xl">
          Our platform is currently in beta and invite-only
          <span className="inline md:block">
            Contact us to join our family of early adopters
          </span>
        </p>

        <div className="reveal-text invisible">
          <Button
            variant="secondary"
            className="rounded-full bg-white px-8 py-3 text-sm font-medium text-black md:text-base"
          >
            Our Family
          </Button>
        </div>
      </div>
    </div>
  )
}
