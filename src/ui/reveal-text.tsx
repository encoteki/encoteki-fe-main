'use client'

import { useRef, type ElementType } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP)
}

interface RevealTextProps {
  text: string
  as?: ElementType
  className?: string
  delay?: number
  triggerType?: 'scroll' | 'manual' | 'immediate'
  align?: 'left' | 'center' | 'right'
}

const RevealText = ({
  text,
  as: Tag = 'h1',
  className = '',
  delay = 0,
  triggerType = 'scroll',
  align = 'left',
}: RevealTextProps) => {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const element = containerRef.current
      if (!element) return

      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

      if (prefersReduced) {
        gsap.set(element, { autoAlpha: 1 })
        return
      }

      let childSplit: SplitText | null = null
      let parentSplit: SplitText | null = null
      let anim: gsap.core.Tween | null = null

      const initAnimation = () => {
        gsap.set(element, { autoAlpha: 1 })

        parentSplit = new SplitText(element, {
          type: 'lines',
          linesClass: 'overflow-hidden',
        })

        childSplit = new SplitText(element, {
          type: 'lines',
          linesClass: 'split-child',
        })

        gsap.set(childSplit.lines, { yPercent: 100, opacity: 0 })

        if (triggerType === 'scroll') {
          anim = gsap.to(childSplit.lines, {
            yPercent: 0,
            opacity: 1,
            duration: 1.5,
            ease: 'power4.out',
            stagger: 0.1,
            delay,
            scrollTrigger: {
              trigger: element,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          })
        } else if (triggerType === 'immediate') {
          anim = gsap.to(childSplit.lines, {
            yPercent: 0,
            opacity: 1,
            duration: 1.5,
            ease: 'power4.out',
            stagger: 0.1,
            delay,
          })
        }
      }

      document.fonts.ready.then(() => {
        if (containerRef.current) initAnimation()
      })

      return () => {
        if (anim) anim.kill()
        if (childSplit) childSplit.revert()
        if (parentSplit) parentSplit.revert()
      }
    },
    { scope: containerRef, dependencies: [text, triggerType, delay] },
  )

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  }

  return (
    <Tag
      ref={containerRef}
      className={cn(
        'text-4xl leading-snug font-bold md:text-6xl',
        alignmentClasses[align],
        className,
      )}
      style={{ visibility: 'hidden' }}
    >
      {text}
    </Tag>
  )
}

export default RevealText
