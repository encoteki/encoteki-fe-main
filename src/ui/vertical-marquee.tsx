'use client'

import { useRef, useState, useEffect } from 'react'
import Image, { StaticImageData } from 'next/image'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/utils'

// Images
import Gajara from '@/assets/collections/gajara.png'
import Cendry from '@/assets/collections/cendry.png'
import Kanghoon from '@/assets/collections/kanghoon.png'
import Komesi from '@/assets/collections/komesi.png'
import Owen from '@/assets/collections/owen.png'
import Tiggy from '@/assets/collections/tiggy.png'

const IMAGES = [Gajara, Cendry, Kanghoon, Komesi, Owen, Tiggy]

const shuffle = (array: StaticImageData[]) =>
  [...array].sort(() => Math.random() - 0.5)

export default function VerticalMarquee({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  const [columns, setColumns] = useState({
    col1: [...IMAGES, ...IMAGES, ...IMAGES, ...IMAGES],
    col2: [...IMAGES, ...IMAGES, ...IMAGES, ...IMAGES],
    col3: [...IMAGES, ...IMAGES, ...IMAGES, ...IMAGES],
    col4: [...IMAGES, ...IMAGES, ...IMAGES, ...IMAGES],
  })

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setColumns({
      col1: [...IMAGES, ...IMAGES, ...IMAGES, ...IMAGES],
      col2: [
        ...shuffle(IMAGES),
        ...shuffle(IMAGES),
        ...shuffle(IMAGES),
        ...shuffle(IMAGES),
      ],
      col3: [
        ...shuffle(IMAGES),
        ...shuffle(IMAGES),
        ...shuffle(IMAGES),
        ...shuffle(IMAGES),
      ],
      col4: [
        ...shuffle(IMAGES),
        ...shuffle(IMAGES),
        ...shuffle(IMAGES),
        ...shuffle(IMAGES),
      ],
    })
  }, [])

  useGSAP(
    () => {
      gsap.fromTo(
        '.col-up',
        { yPercent: 0 },
        {
          yPercent: -50,
          duration: 60,
          ease: 'none',
          repeat: -1,
        },
      )

      gsap.fromTo(
        '.col-down',
        { yPercent: -50 },
        {
          yPercent: 0,
          duration: 50,
          ease: 'none',
          repeat: -1,
        },
      )
    },
    { scope: containerRef },
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex h-full w-full items-center justify-center overflow-hidden mask-[linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)]',
        className,
      )}
    >
      <div className="grid h-full w-full grid-cols-2 gap-6 md:grid-cols-4">
        {/* --- Col 1 */}
        <div className="col-up flex -translate-y-[10%] flex-col gap-4">
          {columns.col1.map((src, i) => (
            <CardItem key={`c1-${i}`} src={src} />
          ))}
        </div>

        {/* --- Col 2 */}
        <div className="col-down flex flex-col gap-6">
          {columns.col2.map((src, i) => (
            <CardItem key={`c2-${i}`} src={src} />
          ))}
        </div>

        {/* --- Col 3 */}
        <div className="col-up hidden -translate-y-[20%] flex-col gap-6 md:flex">
          {columns.col3.map((src, i) => (
            <CardItem key={`c3-${i}`} src={src} />
          ))}
        </div>

        {/* --- Col 4 */}
        <div className="col-down hidden -translate-y-[15%] flex-col gap-6 md:flex">
          {columns.col4.map((src, i) => (
            <CardItem key={`c4-${i}`} src={src} />
          ))}
        </div>
      </div>
    </div>
  )
}

function CardItem({ src }: { src: StaticImageData }) {
  return (
    <div className="relative aspect-3/4 w-full shrink-0 overflow-hidden rounded-xl border-2 border-black bg-white">
      <Image
        src={src}
        alt="Gallery"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, 25vw"
      />
    </div>
  )
}
