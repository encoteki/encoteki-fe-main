'use client'

import { useRef } from 'react'
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
  className?: string
  delay?: number
  triggerType?: 'scroll' | 'manual'
  align?: 'left' | 'center' | 'right'
}

const RevealText = ({
  text,
  className = '',
  delay = 0,
  triggerType = 'scroll',
  align = 'left',
}: RevealTextProps) => {
  const containerRef = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      let childSplit: SplitText | null = null
      let parentSplit: SplitText | null = null
      let anim: gsap.core.Tween | null = null

      const initAnimation = () => {
        const element = containerRef.current
        if (!element) return

        // Setup Scroller
        const scrollContainer = document.querySelector('.scrollable-content')
        const isInsideScrollable = scrollContainer?.contains(element)
        const scrollerTarget = isInsideScrollable
          ? '.scrollable-content'
          : window

        gsap.set(element, { autoAlpha: 1, visibility: 'visible' })

        const targetLineClass =
          triggerType === 'manual' ? 'split-child' : 'split-line-scroll'

        // 1. Child Split
        childSplit = new SplitText(element, {
          type: 'lines',
          linesClass: targetLineClass,
        })

        // 2. Parent Split (Wrapper/Masking)
        parentSplit = new SplitText(element, {
          type: 'lines',
          linesClass: 'split-parent overflow-hidden',
        })

        // 3. Setup
        if (triggerType === 'manual') {
          gsap.set(childSplit.lines, { yPercent: 100, opacity: 0 })
        } else {
          gsap.set(childSplit.lines, { yPercent: 100, opacity: 0 })

          anim = gsap.to(childSplit.lines, {
            yPercent: 0,
            opacity: 1,
            duration: 1.5,
            ease: 'power4.out',
            stagger: 0.1,
            delay: delay,
            scrollTrigger: {
              trigger: element,
              scroller: scrollerTarget,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
              invalidateOnRefresh: true,
            },
          })
        }
      }

      document.fonts.ready.then(() => {
        if (containerRef.current) {
          initAnimation()
        }
      })

      // CLEANUP FUNCTION
      return () => {
        if (childSplit) childSplit.revert()
        if (parentSplit) parentSplit.revert()
        if (anim) anim.kill()
      }
    },
    { scope: containerRef, dependencies: [text, triggerType, align] },
  )

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  }

  return (
    <h1
      ref={containerRef}
      className={cn(
        'text-4xl leading-snug font-bold md:text-6xl',
        alignmentClasses[align],
        className,
      )}
      style={{ visibility: 'hidden' }}
    >
      {text}
    </h1>
  )
}

export default RevealText
