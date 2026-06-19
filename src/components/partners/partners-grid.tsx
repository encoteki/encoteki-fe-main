'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback, useRef } from 'react'
import { ArrowUpRight, ArrowDown, Loader2, RefreshCw } from 'lucide-react'
import gsap, { useGSAP, ScrollTrigger } from '@/lib/gsap'
import DealModal from '@/components/partners/deals-modal'
import { Partners } from '@/types/partner.type'
import type { PartnersResponse } from '@/lib/data/partner'

const ITEMS_PER_LOAD = 12

interface PartnersGridProps {
  initialData?: Partners[]
  initialHasMore?: boolean
}

export default function PartnersGrid({
  initialData,
  initialHasMore,
}: PartnersGridProps) {
  const [partners, setPartners] = useState<Partners[]>(initialData ?? [])
  const [selectedDeal, setSelectedDeal] = useState<Partners | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(initialData === undefined)
  const [hasMore, setHasMore] = useState(initialHasMore ?? false)
  const [isError, setIsError] = useState(false)
  const [page, setPage] = useState(1)
  const skipInitialFetch = useRef(initialData !== undefined)
  const gridRef = useRef<HTMLDivElement>(null)
  const triggerCardRef = useRef<HTMLButtonElement | null>(null)

  const loadPartnersData = useCallback(
    async (pageNumber: number, limit: number, isAppend: boolean) => {
      setIsLoading(true)
      setIsError(false)
      try {
        const res = await fetch(
          `/api/partners?page=${pageNumber}&limit=${limit}`,
        )
        if (!res.ok) throw new Error('fetch failed')
        const result = (await res.json()) as PartnersResponse

        if (result.success && result.data) {
          setHasMore(result.hasNextPage ?? false)
          if (isAppend) {
            setPartners((prev) => [...prev, ...result.data])
          } else {
            setPartners(result.data)
          }
        }
      } catch {
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    if (skipInitialFetch.current) return
    loadPartnersData(1, ITEMS_PER_LOAD, false)
  }, [loadPartnersData])

  const prevCountRef = useRef(0)

  useGSAP(
    () => {
      if (!gridRef.current || partners.length === 0) return

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const allCards = gsap.utils.toArray<HTMLElement>('.partner-card')
        const newCards = allCards.slice(prevCountRef.current)

        if (newCards.length === 0) return

        gsap.set(newCards, { y: 30, opacity: 0 })

        ScrollTrigger.batch(newCards, {
          start: 'top 92%',
          onEnter: (batch) => {
            gsap.to(batch, {
              y: 0,
              opacity: 1,
              stagger: 0.05,
              duration: 0.5,
              ease: 'power3.out',
              overwrite: true,
            })
          },
        })

        prevCountRef.current = allCards.length
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        const allCards = gsap.utils.toArray<HTMLElement>('.partner-card')
        gsap.set(allCards, { y: 0, opacity: 1 })
        prevCountRef.current = allCards.length
      })
    },
    { scope: gridRef, dependencies: [partners] },
  )

  const handleRetry = () => {
    setPage(1)
    loadPartnersData(1, ITEMS_PER_LOAD, false)
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadPartnersData(nextPage, ITEMS_PER_LOAD, true)
  }

  const handleCardClick = (item: Partners, el: HTMLButtonElement) => {
    triggerCardRef.current = el
    setSelectedDeal(item)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedDeal(null)
    // Return focus to the card that opened the modal
    triggerCardRef.current?.focus()
    triggerCardRef.current = null
  }

  if (partners.length === 0) {
    return (
      <div className="flex min-h-100 w-full flex-col items-center justify-center py-20 text-center">
        {isLoading ? (
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-(--primary-black)" />
            <p className="font-mono text-sm text-(--neutral-30)">
              Fetching deals...
            </p>
          </div>
        ) : isError ? (
          <button
            onClick={handleRetry}
            className="group flex items-center gap-2 rounded-full border-2 border-(--primary-black) bg-white px-6 py-3 text-sm font-bold text-(--primary-black) shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:translate-y-0.5 hover:bg-[#ccf281] hover:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] active:translate-y-1 active:shadow-none"
          >
            <RefreshCw className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180" />
            Try Again
          </button>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <p className="font-mono text-sm tracking-widest text-(--neutral-40) uppercase">
              No deals yet
            </p>
            <p className="text-sm text-(--neutral-40)">
              Check back soon for exclusive partner offers.
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div ref={gridRef} id="partners-grid-top" className="flex flex-col gap-12">
      {/* Deal count sticker */}
      <div className="flex items-center">
        <span className="rotate-1 rounded-lg border-2 border-(--primary-black) bg-[#ff9e00] px-4 py-2 text-xs font-black tracking-widest text-(--primary-black) uppercase shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
          {partners.length}+ deals live
        </span>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-4 pb-2 md:grid-cols-3 md:gap-6 lg:grid-cols-5 xl:grid-cols-6">
        {partners.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={(e) => handleCardClick(item, e.currentTarget)}
            aria-label={`${item.offer} by ${item.name}`}
            className={`partner-card group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border-2 border-(--primary-black) bg-white text-left shadow-[0_0_0_0_rgba(26,26,26,1)] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:-translate-y-2 hover:shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--primary-blue) active:translate-y-0 active:shadow-none ${index % 4 === 0 ? 'hover:rotate-[-0.8deg]' : index % 4 === 1 ? 'hover:rotate-[0.5deg]' : index % 4 === 2 ? 'hover:rotate-[-0.4deg]' : 'hover:rotate-[0.8deg]'}`}
          >
            {/* Top Area: Image */}
            <div className="relative aspect-square w-full overflow-hidden border-b-2 border-(--primary-black) bg-white p-6">
              <div className="relative h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                  priority={false}
                />
              </div>

              {/* Icon */}
              <div className="absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-(--primary-black) bg-white opacity-0 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all duration-300 group-hover:opacity-100">
                <ArrowUpRight
                  className="h-4 w-4 text-(--primary-black)"
                  strokeWidth={2.5}
                />
              </div>
            </div>

            {/* Bottom Area: Text */}
            <div className="flex flex-1 flex-col justify-between p-4">
              <div>
                <h3 className="mb-1 text-sm leading-tight font-medium text-(--primary-black) md:text-base lg:text-lg">
                  {item.offer}
                </h3>
                <p className="font-mono text-xs text-(--neutral-40)">
                  {item.name}
                </p>
              </div>

              {/* Badge */}
              <div className="mt-4 flex justify-start">
                <span className="inline-block border-2 border-(--primary-black) bg-[#ccf281] px-2 py-0.5 text-[10px] font-bold tracking-wider text-(--primary-black) uppercase transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105">
                  {item.is_offline ? 'OFFLINE' : 'ONLINE'}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pb-12">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="group flex items-center gap-2 rounded-full border-2 border-(--primary-black) bg-white px-6 py-3 text-sm font-bold text-(--primary-black) shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:translate-y-0.5 hover:bg-[#ccf281] hover:shadow-[1px_1px_0px_0px_rgba(26,26,26,1)] active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[3px_3px_0px_0px_rgba(26,26,26,1)]"
          >
            {isLoading ? (
              <>
                Loading...
                <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                Load More
                <ArrowDown
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                  strokeWidth={2.5}
                />
              </>
            )}
          </button>
        </div>
      )}

      <DealModal
        deal={selectedDeal}
        isOpen={isModalOpen}
        onCloseAction={handleCloseModal}
      />
    </div>
  )
}
