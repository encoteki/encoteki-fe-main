'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { getFamilies } from '@/services/family'
import { Family } from '@/types/family'
import Loading from '@/app/loading'
import { BrutalismButton } from '@/ui/Button'

const ITEMS_PER_LOAD = 9

export default function FamilyGrid() {
  const [families, setFamilies] = useState<Family[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)

  const loadFamiliesData = useCallback(
    async (pageNumber: number, limit: number, isAppend: boolean) => {
      setIsLoading(true)
      try {
        const rawData = await getFamilies(pageNumber, limit)

        if (rawData) {
          let newData = rawData
          let hasNextPage = false

          if (rawData.length > limit) {
            hasNextPage = true
            newData = rawData.slice(0, limit)
          }

          setHasMore(hasNextPage)

          if (isAppend) {
            setFamilies((prev) => [...prev, ...newData])
          } else {
            setFamilies(newData)
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
    loadFamiliesData(1, ITEMS_PER_LOAD, false)
  }, [loadFamiliesData])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadFamiliesData(nextPage, ITEMS_PER_LOAD, true)
  }

  return (
    <>
      {families.length > 0 ? (
        <div className="flex flex-col gap-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {families.map((family) => (
              <Link
                key={family.id}
                href={family.link || '#'}
                target={family.link ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="group relative flex h-full flex-col justify-between rounded-xl border-2 border-black bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-gray-50"
              >
                <>
                  <div className="mb-5 flex items-start justify-between">
                    <div className="relative flex h-14 max-w-[120px] items-center justify-start">
                      {family.image ? (
                        <Image
                          src={family.image}
                          alt={family.name}
                          width={999}
                          height={999}
                          className="h-full w-auto object-contain object-left"
                          priority
                        />
                      ) : (
                        <div className="text-xl font-bold text-black">
                          {family.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <ExternalLink className="h-6 w-6 text-black opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  {/* Content */}
                  <h3 className="mb-2 text-xl font-black tracking-tight text-black uppercase transition-colors">
                    {family.name}
                  </h3>
                  <p className="mb-6 line-clamp-3 text-sm leading-relaxed font-medium text-gray-800">
                    {family.description}
                  </p>
                </>

                {/* Tags */}
                <div className="mt-auto flex flex-wrap gap-2">
                  <span className="rounded-full border-2 border-black bg-[#ccf281] px-3 py-1 text-xs font-medium text-black uppercase transition-colors">
                    {family.tags}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-8">
              <BrutalismButton
                className="rounded-full bg-white px-8 py-3 text-sm font-medium text-black md:text-base"
                label="Load More"
                onClick={handleLoadMore}
              />
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex h-64 flex-col items-center justify-center text-center">
            {isLoading ? (
              <Loading />
            ) : (
              <div className="flex h-[400px] w-full items-center justify-center text-gray-500 italic">
                No families found
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}
