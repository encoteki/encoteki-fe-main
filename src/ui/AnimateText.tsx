'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)
}

interface AnimateTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  align?: 'left' | 'center' | 'right'
  triggerType?: 'load' | 'scroll'
}

export default function AnimateText({
  text,
  className = '',
  delay = 0,
  duration = 0.8,
  align = 'left',
  triggerType = 'scroll',
}: AnimateTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const split = new SplitText(containerRef.current, {
        type: 'words,chars',
        linesClass: 'split-line',
      })

      gsap.set(containerRef.current, { perspective: 400 })

      const animConfig: gsap.TweenVars = {
        duration: duration,
        opacity: 0,
        scale: 0,
        y: 80,
        rotationX: 180,
        transformOrigin: '0% 50% -50',
        ease: 'back',
        stagger: 0.01,
        delay: delay,
      }

      if (triggerType === 'scroll') {
        animConfig.scrollTrigger = {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      }

      gsap.from(split.chars, animConfig)

      return () => {
        split.revert()
      }
    },
    { scope: containerRef, dependencies: [text] },
  )

  const alignClass =
    align === 'center'
      ? 'text-center justify-center'
      : align === 'right'
        ? 'text-right justify-end'
        : 'text-left justify-start'

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${alignClass} ${className}`}
      style={{ opacity: 1 }}
    >
      {text}
    </div>
  )
}
