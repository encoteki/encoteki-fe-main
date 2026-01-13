'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import DealModal from '@/components/partners/deals-modal'
import { Partners } from '@/types/partners'
import { getPartners } from '@/services/partners'
import Loading from '@/app/loading'

export default function PartnersGrid() {
  const [partners, setPartners] = useState<Partners[]>([])
  const [selectedDeal, setSelectedDeal] = useState<Partners | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // State Logic
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Pagination Config
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [isPaginationMode, setIsPaginationMode] = useState(true)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const loadPartnersData = useCallback(
    async (pageNumber: number, limit: number, isAppend: boolean) => {
      setIsLoading(true)
      try {
        const rawData = await getPartners(pageNumber, limit)

        if (rawData) {
          let newData = rawData
          let hasNextPage = false

          if (rawData.length > limit) {
            hasNextPage = true
            newData = rawData.slice(0, limit)
          } else {
            hasNextPage = false
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

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      let newLimit = 6
      let newModePagination = true

      if (width >= 1280) {
        newLimit = 6
        newModePagination = true
      } else if (width >= 1024) {
        newLimit = 5
        newModePagination = true
      } else {
        newLimit = 6
        newModePagination = false
      }

      setItemsPerPage((prevLimit) => {
        if (prevLimit !== newLimit) return newLimit
        return prevLimit
      })

      setIsPaginationMode((prevMode) => {
        return newModePagination
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setPage(1)
    setHasMore(true)
    setPartners([])
    loadPartnersData(1, itemsPerPage, false)
  }, [itemsPerPage, isPaginationMode, loadPartnersData])

  const handleNextPage = () => {
    const nextPage = page + 1
    setPage(nextPage)
    scrollToTop()
    loadPartnersData(nextPage, itemsPerPage, false)
  }

  const handlePrevPage = () => {
    if (page > 1) {
      const prevPage = page - 1
      setPage(prevPage)
      setHasMore(true)
      scrollToTop()
      loadPartnersData(prevPage, itemsPerPage, false)
    }
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadPartnersData(nextPage, itemsPerPage, true)
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
    <div id="partners-grid-top" className="flex scroll-mt-24 flex-col px-1">
      <div
        className={`relative w-full transition-all duration-300 ${
          isPaginationMode ? 'min-h-[400px]' : ''
        }`}
      >
        {isLoading && partners.length === 0 ? (
          <div className="flex h-[400px] w-full items-center justify-center">
            <Loading />
          </div>
        ) : partners.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 pb-2 md:grid-cols-3 md:gap-6 lg:grid-cols-5 xl:grid-cols-6">
            {partners.map((item) => (
              <div
                key={item.id}
                onClick={() => handleCardClick(item)}
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border-3 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:-translate-y-1 hover:bg-[#fffaeb] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                {/* Top Area: Image */}
                <div className="relative aspect-square w-full overflow-hidden border-b-3 border-black bg-white p-6">
                  <div className="relative h-full w-full transition-transform duration-500 group-hover:scale-110">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                      priority={true}
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
                    <h3 className="mb-1 text-sm leading-tight font-bold text-black md:text-base lg:text-lg">
                      {item.offer}
                    </h3>
                    <p className="font-mono text-xs text-gray-600">
                      {item.name}
                    </p>
                  </div>

                  {/* Badge */}
                  <div className="mt-4 flex justify-start">
                    <span className="inline-block border-2 border-black bg-[#ccf281] px-2 py-0.5 text-[10px] font-bold tracking-wider text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {item.is_offline ? 'OFFLINE' : 'ONLINE'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-[400px] w-full items-center justify-center text-gray-500 italic">
            No deals found.
          </div>
        )}
      </div>

      {/* --- Pagination Controls --- */}
      <div className="mt-8 flex items-center justify-center gap-4 pb-12 md:mt-12 md:gap-6">
        {!isLoading && (
          <>
            {isPaginationMode ? (
              <>
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-3 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none md:h-14 md:w-14"
                  aria-label="Previous Page"
                >
                  <ArrowLeft
                    className="h-5 w-5 text-black transition-transform group-hover:-translate-x-1 md:h-6 md:w-6"
                    strokeWidth={3}
                  />
                </button>

                <button
                  onClick={handleNextPage}
                  disabled={!hasMore}
                  className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-3 border-black bg-[#FF9E00] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none md:h-14 md:w-14"
                  aria-label="Next Page"
                >
                  <ArrowRight
                    className="h-5 w-5 text-black transition-transform group-hover:translate-x-1 md:h-6 md:w-6"
                    strokeWidth={3}
                  />
                </button>
              </>
            ) : (
              hasMore && (
                <button
                  onClick={handleLoadMore}
                  className="flex items-center gap-2 rounded-full border-3 border-black bg-white px-8 py-3 text-sm font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-none active:translate-y-1 active:shadow-none"
                >
                  Load More Deals
                </button>
              )
            )}
          </>
        )}
      </div>

      <DealModal
        deal={selectedDeal}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}
