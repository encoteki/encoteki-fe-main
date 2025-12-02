'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import InstagramIcon from '@/assets/socials/Instagram'
import ThreadsIcon from '@/assets/socials/Threads'
import XIcon from '@/assets/socials/X'
import TiktokIcon from '@/assets/socials/Tiktok'
import TelegramIcon from '@/assets/socials/Telegram'
import { cn } from '@/lib/utils'

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

export default function Footer() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <footer className="mx-auto w-full rounded-t-3xl bg-(--primary-green) px-16 py-16 md:rounded-t-[64px] md:px-32 lg:px-32 lg:py-48">
      <div className="flex h-auto flex-col justify-between gap-10 md:flex-row">
        {/* Left Content: Title & Socials */}
        <section className="flex flex-col gap-4 md:w-1/2 md:justify-between md:gap-10">
          <h1 className="text-xl font-medium text-white lg:text-4xl">
            Join the community and save the world!
          </h1>

          <nav className="flex gap-9" aria-label="Social media links">
            {SOCIAL_MEDIA.map((item) => (
              <Link
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow us on ${item.name}`}
                className="text-white transition-transform duration-300 hover:scale-125"
              >
                {item.icon}
              </Link>
            ))}
          </nav>
        </section>

        {/* Right Content: Copyright */}
        <div
          className={cn(
            'flex flex-col justify-end md:w-1/2',
            isHome ? 'text-right' : 'items-end',
          )}
        >
          <p
            className={cn(
              'text-sm font-normal text-white',
              isHome ? 'text-left md:text-right' : '',
            )}
          >
            Encoteki © {CURRENT_YEAR} All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}
