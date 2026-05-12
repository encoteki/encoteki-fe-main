'use client'

import { useEffect, useRef, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Partners } from '@/types/partner.type'
import { BrutalismButton } from '@/ui/buttons'
import DOMPurify from 'dompurify'

export default function DealModal({
  deal,
  isOpen,
  onCloseAction,
}: {
  deal: Partners | null
  isOpen: boolean
  onCloseAction: () => void
}) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const sanitizedTnc = useMemo(() => {
    if (!deal?.tnc) return ''
    return DOMPurify.sanitize(deal.tnc, {
      ALLOWED_TAGS: [
        'li',
        'ul',
        'ol',
        'p',
        'br',
        'strong',
        'em',
        'b',
        'i',
        'span',
      ],
      ALLOWED_ATTR: ['class'],
    })
  }, [deal])

  const handleClose = useCallback(() => {
    if (overlayRef.current && modalRef.current) {
      const tl = gsap.timeline({ onComplete: onCloseAction })
      tl.to(modalRef.current, {
        opacity: 0,
        scale: 0.95,
        y: 10,
        duration: 0.2,
        ease: 'power2.in',
      })
      tl.to(
        overlayRef.current,
        { opacity: 0, duration: 0.2, ease: 'power2.in' },
        '<',
      )
    } else {
      onCloseAction()
    }
  }, [onCloseAction])

  // Prevent scroll
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

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, handleClose])

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return

    const modal = modalRef.current
    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

    // Auto-focus the close button on open
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

  // GSAP entrance
  useGSAP(
    () => {
      if (isOpen && overlayRef.current && modalRef.current) {
        const tl = gsap.timeline()
        tl.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'power2.out' },
        )
        tl.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.92, y: 30, rotation: -1 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotation: 0,
            duration: 0.5,
            ease: 'power3.out',
          },
          '-=0.15',
        )
      }
    },
    { dependencies: [isOpen], scope: containerRef },
  )

  if (!isOpen || !deal) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24 pb-10 md:items-center md:py-20"
      role="dialog"
      aria-modal="true"
      aria-labelledby="deal-modal-title"
    >
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-(--primary-black)/40 opacity-0 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div
        ref={modalRef}
        className="relative z-10 flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-2xl border-3 border-(--primary-black) bg-white opacity-0 shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] md:max-w-3xl xl:max-w-4xl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b-3 border-(--primary-black) bg-white px-5 py-4 md:px-8 md:py-5">
          <div className="flex items-center gap-3">
            <h2
              id="deal-modal-title"
              className="text-lg font-black tracking-tight text-(--primary-black) uppercase md:text-xl"
            >
              {deal.name}
            </h2>
            <span className="rounded-sm border-2 border-(--primary-black) bg-[#ccf281] px-2 py-0.5 text-[10px] font-bold tracking-wider text-(--primary-black) uppercase">
              {deal.is_offline ? 'Offline' : 'Online'}
            </span>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close deal"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-(--primary-black) bg-white shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:translate-y-0.5 hover:bg-(--red-90) hover:shadow-none active:translate-y-1"
          >
            <X className="h-5 w-5 text-(--primary-black)" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col overflow-y-auto md:flex-row">
          {/* LEFT: Details */}
          <div className="flex-1 p-5 md:p-8">
            <h3 className="mb-6 text-2xl leading-tight font-black tracking-tight text-(--primary-black) uppercase md:text-4xl">
              {deal.offer}
            </h3>

            {/* Terms & Conditions */}
            {sanitizedTnc && (
              <div className="rounded-xl border-2 border-dashed border-(--neutral-60) bg-(--khaki-99) p-5">
                <h5 className="mb-3 text-xs font-black tracking-widest text-(--primary-black) uppercase">
                  Terms & Conditions
                </h5>
                <ul
                  className="list-disc space-y-2 pl-5 text-sm leading-relaxed font-medium text-(--neutral-30) md:text-base"
                  dangerouslySetInnerHTML={{ __html: sanitizedTnc }}
                />
              </div>
            )}
          </div>

          {/* RIGHT: Sidebar */}
          <div className="w-full shrink-0 border-t-3 border-(--primary-black) bg-(--khaki-90) p-5 md:w-[320px] md:border-t-0 md:border-l-3 md:p-8 xl:w-90">
            <div className="mb-6 flex items-start gap-4">
              {/* Logo Box */}
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-(--primary-black) bg-white shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
                <Image
                  src={deal.image}
                  alt={deal.name}
                  fill
                  className="object-contain p-2"
                  sizes="80px"
                />
              </div>
              <div className="pt-1">
                <h4 className="text-base font-bold text-(--primary-black) md:text-lg">
                  {deal.name}
                </h4>
                <p className="mt-1 text-xs leading-snug font-medium text-(--neutral-30)">
                  {deal.description}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {!deal.is_offline && (
                <BrutalismButton
                  label="Claim Deal"
                  href={`https://claim.encoteki.com/deals/EPD${String(deal.id).padStart(4, '0')}`}
                  className="w-full"
                />
              )}

              <BrutalismButton
                label="Visit Store"
                bgColor="bg-[#ccf281]"
                href={deal.store_url}
                className="w-full"
              />
            </div>

            {/* SDGs Section (planned content) */}
            <div className="mt-8 border-t-2 border-dashed border-(--neutral-60) pt-4">
              <p className="text-xs font-black tracking-wider text-(--neutral-40) uppercase">
                Sustainable Goals
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
