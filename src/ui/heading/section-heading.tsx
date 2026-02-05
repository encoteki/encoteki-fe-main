'use client'

import React, { useRef } from 'react'
import RevealText from '../reveal-text'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface SectionHeadingProps {
  title: string
  desc: string | React.ReactNode
  className?: string
  titleClassName?: string
  descClassName?: string
  align?: 'left' | 'center' | 'right'
}

export default function SectionHeading({
  title,
  desc,
  className = '',
  titleClassName = '',
  descClassName = '',
  align = 'left',
}: SectionHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (typeof desc !== 'string') {
        gsap.fromTo(
          '.custom-desc-anim',
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.5,
            ease: 'power3.out',
            delay: 0.2,
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 85%',
            },
          },
        )
      }
    },
    { dependencies: [desc], scope: containerRef },
  )

  return (
    <div
      ref={containerRef}
      className={`flex w-full flex-col space-y-6 md:space-y-8 lg:space-y-12 ${
        align === 'center'
          ? 'items-center text-center'
          : align === 'right'
            ? 'items-end text-right'
            : 'items-start text-left'
      } ${className}`}
    >
      <RevealText
        text={title}
        className={`text-6xl leading-[0.9] font-bold md:text-8xl lg:text-9xl ${titleClassName}`}
        delay={0}
        align={align}
        triggerType="scroll"
      />

      {typeof desc === 'string' ? (
        <RevealText
          text={desc}
          className={`text-lg font-normal md:text-xl lg:text-3xl ${descClassName}`}
          delay={0.2}
          align={align}
          triggerType="scroll"
        />
      ) : (
        <div
          className={`custom-desc-anim text-lg font-normal opacity-0 will-change-transform md:text-xl lg:text-3xl ${descClassName}`}
        >
          {desc}
        </div>
      )}
    </div>
  )
}
