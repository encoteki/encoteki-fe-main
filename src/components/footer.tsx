'use client'

import gsap from 'gsap'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import { useEffect, useRef, useState } from 'react'
import InstagramIcon from '@/assets/socials/instagram.svg'
import ThreadsIcon from '@/assets/socials/threads.svg'
import XIcon from '@/assets/socials/x.svg'
import TiktokIcon from '@/assets/socials/tiktok.svg'
import TelegramIcon from '@/assets/socials/telegram.svg'

type SocialMediaItem = {
  name: string
  icon: React.ReactNode
  url: string
}

const SOCIAL_MEDIA: SocialMediaItem[] = [
  {
    name: 'Instagram',
    icon: <InstagramIcon />,
    url: 'https://www.instagram.com/encoteki/',
  },
  {
    name: 'Threads',
    icon: <ThreadsIcon />,
    url: 'https://www.threads.net/@encoteki',
  },
  { name: 'X', icon: <XIcon />, url: 'https://x.com/encoteki' },
  {
    name: 'Tiktok',
    icon: <TiktokIcon />,
    url: 'https://www.tiktok.com/@encoteki',
  },
  { name: 'Telegram', icon: <TelegramIcon />, url: 'https://t.me/encoteki' },
]

const CURRENT_YEAR = new Date().getFullYear()

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP)
}

export function Footer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
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

      const targets = gsap.utils.toArray('.footer-reveal-text')

      if (prefersReduced) {
        gsap.set(targets, { autoAlpha: 1, y: 0 })
        return
      }

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

      if (isVisible) tl.restart()
      else tl.pause(0)
    },
    { scope: containerRef, dependencies: [isVisible] },
  )

  return (
    <footer
      ref={containerRef}
      className="home-container flex flex-col justify-between gap-10 bg-[var(--green-10)]"
    >
      <div className="w-full text-left">
        <h2 className="footer-reveal-text text-6xl font-bold text-[var(--khaki-99)] lg:text-9xl">
          <span className="block">Join the community</span>
          <span className="block">and</span>
          <span className="block">save the world!</span>
        </h2>
      </div>

      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <nav
          className="footer-reveal-text flex flex-row items-center justify-center gap-4 md:gap-12"
          aria-label="Social media links"
        >
          {SOCIAL_MEDIA.map((item) => (
            <Link
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.name}
              className="text-2xl text-[var(--khaki-99)] transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-125"
            >
              {item.icon}
            </Link>
          ))}
        </nav>

        <p className="footer-reveal-text text-center text-base font-normal text-[var(--khaki-99)]/70 md:text-lg">
          Encoteki © {CURRENT_YEAR} All rights reserved
        </p>
      </div>
    </footer>
  )
}
