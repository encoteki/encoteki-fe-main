'use client'

import Image from 'next/image'
import { useState, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import DealModal from '@/components/partners/deals-modal'
import { Partners } from '@/types/partner.type'
import posthog from 'posthog-js'
import {
  usePaginatedGrid,
  GridStatus,
  LoadMoreButton,
} from '@/ui/paginated-grid'

const ITEMS_PER_LOAD = 12

interface PartnersGridProps {
  initialData?: Partners[]
  initialHasMore?: boolean
}

export default function PartnersGrid({
  initialData,
  initialHasMore,
}: PartnersGridProps) {
  const {
    items: partners,
    isLoading,
    isError,
    hasMore,
    gridRef,
    handleRetry,
    handleLoadMore,
  } = usePaginatedGrid<Partners>({
    endpoint: '/api/partners',
    itemsPerLoad: ITEMS_PER_LOAD,
    initialData,
    initialHasMore,
    loadMoreEvent: 'partners_load_more_clicked',
    cardSelector: '.partner-card',
    reveal: { y: 30, start: 'top 92%', stagger: 0.05, duration: 0.5 },
  })

  const [selectedDeal, setSelectedDeal] = useState<Partners | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const triggerCardRef = useRef<HTMLButtonElement | null>(null)

  const handleCardClick = (item: Partners, el: HTMLButtonElement) => {
    triggerCardRef.current = el
    setSelectedDeal(item)
    setIsModalOpen(true)
    posthog.capture('partner_deal_viewed', {
      partner_id: item.id,
      partner_name: item.name,
      offer: item.offer,
      is_offline: item.is_offline,
    })
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
      <GridStatus
        isLoading={isLoading}
        isError={isError}
        onRetry={handleRetry}
        loadingLabel="Fetching deals..."
        emptyTitle="No deals yet"
        emptyDescription="Check back soon for exclusive partner offers."
      />
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
                <p className="font-mono text-xs text-(--neutral-30)">
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
        <LoadMoreButton isLoading={isLoading} onClick={handleLoadMore} />
      )}

      <DealModal
        deal={selectedDeal}
        isOpen={isModalOpen}
        onCloseAction={handleCloseModal}
      />
    </div>
  )
}
