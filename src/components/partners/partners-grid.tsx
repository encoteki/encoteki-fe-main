'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { ArrowUpRight, ArrowDown, Loader2 } from 'lucide-react'
import DealModal from '@/components/partners/deals-modal'
import { Partners } from '@/types/partner.type'
import { getPartners } from '@/services/partner.service'

const ITEMS_PER_LOAD = 12

export default function PartnersGrid() {
  const [partners, setPartners] = useState<Partners[]>([])
  const [selectedDeal, setSelectedDeal] = useState<Partners | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // State Logic
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)

  const loadPartnersData = useCallback(
    async (pageNumber: number, limit: number, isAppend: boolean) => {
      setIsLoading(true)
      try {
        const rawData = await getPartners(pageNumber, limit + 1)

        if (rawData) {
          let newData = rawData
          let hasNextPage = false

          if (rawData.length > limit) {
            hasNextPage = true
            newData = rawData.slice(0, limit)
          }

          setHasMore(hasNextPage)

          if (isAppend) {
            setPartners((prev) => [...prev, ...newData])
          } else {
            setPartners(newData)
          }
        }
      } catch (error) {
        console.error('Failed to load partners:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  // Initial Load
  useEffect(() => {
    loadPartnersData(1, ITEMS_PER_LOAD, false)
  }, [loadPartnersData])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadPartnersData(nextPage, ITEMS_PER_LOAD, true)
  }

  const handleCardClick = (item: Partners) => {
    setSelectedDeal(item)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedDeal(null), 300)
  }

  return (
    <div id="partners-grid-top" className="flex flex-col px-1">
      {partners.length > 0 ? (
        <div className="flex flex-col gap-12">
          {/* GRID */}
          <div className="grid grid-cols-2 gap-4 pb-2 md:grid-cols-3 md:gap-6 lg:grid-cols-5 xl:grid-cols-6">
            {partners.map((item) => (
              <div
                key={item.id}
                onClick={() => handleCardClick(item)}
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border-2 border-black bg-white transition-all duration-200 hover:-translate-y-1"
              >
                {/* Top Area: Image */}
                <div className="relative aspect-square w-full overflow-hidden border-b-2 border-black bg-white p-6">
                  <div className="relative h-full w-full transition-transform duration-500 group-hover:scale-110">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                      priority={false}
                    />
                  </div>

                  {/* Icon Button */}
                  <div className="absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-white opacity-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group-hover:opacity-100">
                    <ArrowUpRight
                      className="h-4 w-4 text-black"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>

                {/* Bottom Area: Text */}
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <h3 className="mb-1 text-sm leading-tight font-medium text-black md:text-base lg:text-lg">
                      {item.offer}
                    </h3>
                    <p className="font-mono text-xs text-gray-600">
                      {item.name}
                    </p>
                  </div>

                  {/* Badge */}
                  <div className="mt-4 flex justify-start">
                    <span className="inline-block border-2 border-black bg-[#ccf281] px-2 py-0.5 text-[10px] font-bold tracking-wider text-black uppercase">
                      {item.is_offline ? 'OFFLINE' : 'ONLINE'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pb-12">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="group flex items-center gap-3 rounded-full border-3 border-black bg-white px-8 py-4 text-xl font-bold text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:bg-[#ccf281] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                {isLoading ? (
                  <>
                    Loading...
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </>
                ) : (
                  <>
                    Load More Deals
                    <ArrowDown
                      className="h-6 w-6 transition-transform group-hover:translate-y-1"
                      strokeWidth={3}
                    />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-100 w-full flex-col items-center justify-center rounded-xl border-3 border-dashed border-black bg-gray-50 text-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-black" />
              <p className="font-mono text-gray-500">Fetching deals...</p>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-black text-gray-400 uppercase">
                No Deals Found
              </h3>
            </>
          )}
        </div>
      )}

      <DealModal
        deal={selectedDeal}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}
