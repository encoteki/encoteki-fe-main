'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import posthog from 'posthog-js'
import type { StoryCharacter } from '@/lib/story/content'

export default function StoryBookModal({
  character,
  isOpen,
  onCloseAction,
}: {
  character: StoryCharacter | null
  isOpen: boolean
  onCloseAction: () => void
}) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [pageIndex, setPageIndex] = useState(0)

  // Reset to page 1 whenever the modal opens on a (possibly different)
  // character, rather than resuming wherever the previous character left
  // off. Done during render (React's recommended pattern for "reset state
  // when a prop changes") rather than in a useEffect, which is what the
  // react-hooks/set-state-in-effect lint rule flags.
  const [lastOpenKey, setLastOpenKey] = useState<string | null>(null)
  const openKey = isOpen ? (character?.slug ?? null) : null
  if (openKey !== lastOpenKey) {
    setLastOpenKey(openKey)
    if (openKey) setPageIndex(0)
  }

  const handleClose = useCallback(() => {
    if (character) {
      posthog.capture('story_book_closed', { character_slug: character.slug })
    }

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (!prefersReduced && overlayRef.current && modalRef.current) {
      const tl = gsap.timeline({ onComplete: onCloseAction })
      tl.to(modalRef.current, {
        opacity: 0,
        scale: 0.97,
        duration: 0.15,
        ease: 'power2.in',
      })
      tl.to(
        overlayRef.current,
        { opacity: 0, duration: 0.15, ease: 'power2.in' },
        '<',
      )
    } else {
      onCloseAction()
    }
  }, [onCloseAction, character])

  const pageCount = character?.pages.length ?? 1

  const goNext = useCallback(() => {
    setPageIndex((i) => Math.min(i + 1, pageCount - 1))
  }, [pageCount])

  const goPrev = useCallback(() => {
    setPageIndex((i) => Math.max(i - 1, 0))
  }, [])

  // Prevent background scroll while open.
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = 'auto'
      document.body.style.paddingRight = '0px'
    }
    return () => {
      document.body.style.overflow = 'auto'
      document.body.style.paddingRight = '0px'
    }
  }, [isOpen])

  // Escape closes, arrow keys page through.
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, handleClose, goNext, goPrev])

  // Focus trap — same approach as DealModal.
  useEffect(() => {
    if (!isOpen || !modalRef.current) return

    const modal = modalRef.current
    const focusableSelector =
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'

    const firstFocusable = modal.querySelector<HTMLElement>(focusableSelector)
    firstFocusable?.focus()

    const trapFocus = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusables = modal.querySelectorAll<HTMLElement>(focusableSelector)
      if (focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', trapFocus)
    return () => document.removeEventListener('keydown', trapFocus)
  }, [isOpen])

  // Entrance: a plain fade + scale, no rotation — this surface's flatter,
  // calmer grammar doesn't use the "paper slap" motion the brutalist
  // DealModal uses. Guarded for prefers-reduced-motion, unlike the source
  // pattern (a gap closed here, not inherited).
  useGSAP(
    () => {
      if (!isOpen || !overlayRef.current || !modalRef.current) return

      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

      if (prefersReduced) {
        gsap.set(overlayRef.current, { opacity: 1 })
        gsap.set(modalRef.current, { opacity: 1, scale: 1 })
        return
      }

      const tl = gsap.timeline()
      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: 'power2.out' },
      )
      tl.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.97 },
        { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' },
        '-=0.1',
      )
    },
    { dependencies: [isOpen], scope: containerRef },
  )

  if (!isOpen || !character) return null

  const page = character.pages[pageIndex]
  const isFirstPage = pageIndex === 0
  const isLastPage = pageIndex === character.pages.length - 1

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="story-book-title"
    >
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-(--primary-black)/30 opacity-0 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div
        ref={modalRef}
        className="relative z-10 flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-(--neutral-60) bg-white opacity-0 shadow-[0_20px_60px_-15px_rgba(26,26,26,0.35)]"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-(--neutral-60) bg-white px-5 py-4">
          <h2
            id="story-book-title"
            className="text-lg font-black tracking-tight text-(--primary-black) uppercase"
          >
            {character.name}&rsquo;s Story
          </h2>
          <button
            onClick={handleClose}
            aria-label="Close story"
            className="flex h-10 w-10 items-center justify-center rounded-full text-(--primary-black) transition-colors duration-200 hover:bg-(--khaki-90) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary-black)"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <div
          aria-live="polite"
          className="flex flex-col overflow-y-auto p-6 md:p-8"
        >
          {/*
            Placeholder-stage image: a solid color block with no real
            pictorial content, so it's marked decorative (aria-hidden) and
            the caption paragraph below is the actual accessible content.
            Once real art replaces this, give the image itself a real,
            distinct `alt` describing the scene (not just the caption
            verbatim) and drop aria-hidden.
          */}
          <div
            aria-hidden="true"
            className="aspect-4/3 w-full rounded-md"
            style={{ backgroundColor: page.placeholderColor }}
          />
          <p className="sr-only">
            Page {pageIndex + 1} of {character.pages.length}.
          </p>
          <p className="mt-6 text-center text-base leading-relaxed text-(--neutral-30)">
            {page.caption}
          </p>
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-(--neutral-60) bg-(--khaki-90) px-5 py-4">
          <button
            type="button"
            onClick={goPrev}
            disabled={isFirstPage}
            aria-label="Previous page"
            className="flex h-10 w-10 items-center justify-center rounded-full text-(--primary-black) transition-colors duration-200 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary-black) disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </button>
          <span
            className="font-mono text-xs text-(--neutral-30)"
            aria-hidden="true"
          >
            Page {pageIndex + 1} of {character.pages.length}
          </span>
          <button
            type="button"
            onClick={goNext}
            disabled={isLastPage}
            aria-label="Next page"
            className="flex h-10 w-10 items-center justify-center rounded-full text-(--primary-black) transition-colors duration-200 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary-black) disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  )
}
