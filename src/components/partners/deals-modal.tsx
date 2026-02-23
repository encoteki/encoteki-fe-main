'use client'

import { useEffect, useRef, useMemo } from 'react'
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
  onClose,
}: {
  deal: Partners | null
  isOpen: boolean
  onClose: () => void
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
  }, [deal?.tnc])

  // Prevent Scroll & Layout Shift Logic
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

  // GSAP Animation
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
          { opacity: 0, scale: 0.95, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            ease: 'back.out(1.2)',
          },
          '-=0.2',
        )
      }
    },
    { dependencies: [isOpen], scope: containerRef },
  )

  const handleClose = () => {
    if (overlayRef.current && modalRef.current) {
      const tl = gsap.timeline({ onComplete: onClose })
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
      onClose()
    }
  }

  if (!isOpen || !deal) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-28 pb-10 md:items-center md:py-24"
    >
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/40 opacity-0 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div
        ref={modalRef}
        className="relative z-10 flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-xl border-2 border-black bg-white opacity-0 md:max-w-3xl xl:max-w-4xl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b-2 border-black bg-white px-5 py-4 md:px-8 md:py-5">
          <h2 className="text-lg font-medium text-black md:text-2xl">
            Deal Info
          </h2>
          <button
            onClick={handleClose}
            className="cursor-pointer hover:scale-105"
          >
            <X className="h-6 w-6 text-black" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col overflow-y-auto md:flex-row">
          {/* LEFT: Details */}
          <div className="flex-1 p-5 md:p-8">
            <h3 className="mb-4 text-xl leading-tight font-semibold text-black md:text-3xl">
              {deal.offer}
            </h3>

            {/* Terms & Conditions */}
            <div className="mb-8 rounded-lg border-2 border-dashed border-gray-400 bg-gray-50 p-4">
              <h5 className="mb-3 text-sm font-bold tracking-widest text-black uppercase">
                Terms & Conditions
              </h5>
              <ul
                className="list-disc space-y-2 pl-5 text-sm leading-relaxed font-medium text-gray-800 md:text-base"
                dangerouslySetInnerHTML={{ __html: sanitizedTnc }}
              />
            </div>
          </div>

          {/* RIGHT: Sidebar */}
          <div className="w-full shrink-0 border-t-2 border-black bg-[#fafafa] p-5 md:w-[320px] md:border-t-0 md:border-l-2 md:p-8 xl:w-90">
            <div className="mb-6 flex items-start gap-4">
              {/* Logo Box */}
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <Image
                  src={deal.image}
                  alt={deal.name}
                  fill
                  className="object-contain p-1"
                  sizes="64px"
                />
              </div>
              <div>
                <h4 className="text-base font-semibold text-black md:text-lg">
                  {deal.name}
                </h4>
                <p className="mt-1 text-xs leading-snug font-medium text-gray-600">
                  {deal.description}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <BrutalismButton label={'Claim Deal'} className="w-full" />
              <BrutalismButton
                label={'Visit Store'}
                bgColor="bg-[#ccf281]"
                href={deal.store_url}
                className="w-full"
              />
            </div>

            {/* SDGs Section */}
            <div className="mt-8 border-t-2 border-dashed border-gray-400 pt-4">
              <p className="mb-3 text-xs font-bold tracking-wider text-gray-500 uppercase">
                Sustainable Goals
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
