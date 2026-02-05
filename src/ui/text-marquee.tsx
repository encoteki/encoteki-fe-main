'use client'

import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/utils'

export type MarqueeItem = string | { text: string; icon?: React.ReactNode }

interface TextMarqueeProps {
  texts: MarqueeItem[]
  className?: string
  separator?: string | React.ReactNode | (string | React.ReactNode)[]
  speed?: number
  repeat?: number
}

export default function TextMarquee({
  texts,
  className = '',
  separator = '-',
  speed = 10,
  repeat = 4,
}: TextMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const firstStrip = useRef<HTMLDivElement>(null)
  const secondStrip = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.to([firstStrip.current, secondStrip.current], {
        xPercent: -100,
        duration: speed,
        ease: 'none',
        repeat: -1,
      })
    },
    { scope: containerRef, dependencies: [speed, texts] },
  )

  const renderContent = () => {
    return (
      <div className="flex items-center">
        {Array.from({ length: repeat }).map((_, loopIndex) => (
          <React.Fragment key={loopIndex}>
            {texts.map((item, textIndex) => {
              const textContent = typeof item === 'string' ? item : item.text
              const iconContent = typeof item === 'object' ? item.icon : null

              let currentSeparator: string | React.ReactNode = separator
              if (Array.isArray(separator)) {
                currentSeparator = separator[textIndex % separator.length]
              }

              return (
                <div key={textIndex} className="flex items-center">
                  <div className="flex items-center gap-3 px-4">
                    <span className="whitespace-nowrap">{textContent}</span>
                    {iconContent && (
                      <span className="flex shrink-0 items-center justify-center">
                        {iconContent}
                      </span>
                    )}
                  </div>

                  <span className="px-2 opacity-50">{currentSeparator}</span>
                </div>
              )
            })}
          </React.Fragment>
        ))}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex w-full overflow-hidden bg-transparent whitespace-nowrap text-black',
        className,
      )}
    >
      <div
        ref={firstStrip}
        className="flex min-w-full shrink-0 items-center justify-around"
      >
        {renderContent()}
      </div>
      <div
        ref={secondStrip}
        className="flex min-w-full shrink-0 items-center justify-around"
      >
        {renderContent()}
      </div>
    </div>
  )
}
