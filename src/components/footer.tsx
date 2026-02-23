'use client'

import gsap from 'gsap'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import { useEffect, useRef, useState } from 'react'
import { TextPlugin } from 'gsap/TextPlugin'
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
  gsap.registerPlugin(TextPlugin, useGSAP)
}

export function Footer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useGSAP(
    () => {
      const targets = gsap.utils.toArray('.footer-reveal-text')
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

      if (isVisible) {
        tl.restart()
      } else {
        tl.pause(0)
      }
    },
    { scope: containerRef, dependencies: [isVisible] },
  )

  return (
    <footer
      ref={containerRef}
      className="home-container flex flex-col justify-between gap-10 bg-(--green-10)"
    >
      <div className="w-full text-left md:text-left">
        <h1 className="footer-reveal-text text-6xl font-medium text-white lg:text-9xl">
          Join the community
        </h1>
        <h1 className="footer-reveal-text text-6xl font-medium text-white lg:text-9xl">
          and
        </h1>
        <h1 className="footer-reveal-text text-6xl font-medium text-white lg:text-9xl">
          save the world!
        </h1>
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
              className="text-2xl text-white transition-transform duration-300 hover:scale-125"
            >
              {item.icon}
            </Link>
          ))}
        </nav>

        <p className="footer-reveal-text text-center text-base font-normal text-white md:text-lg">
          Encoteki © {CURRENT_YEAR} All rights reserved
        </p>
      </div>
    </footer>
  )
}
