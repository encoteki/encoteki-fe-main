'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, ArrowDown, Loader2, RefreshCw } from 'lucide-react'
import gsap, { useGSAP, ScrollTrigger } from '@/lib/gsap'

import { Family } from '@/types/family.type'
import type { FamilyResponse } from '@/lib/data/family'

const ITEMS_PER_LOAD = 9

interface FamilyGridProps {
  initialData?: Family[]
  initialHasMore?: boolean
}

export default function FamilyGrid({
  initialData,
  initialHasMore,
}: FamilyGridProps) {
  const [families, setFamilies] = useState<Family[]>(initialData ?? [])
  const [isLoading, setIsLoading] = useState(initialData === undefined)
  const [isError, setIsError] = useState(false)
  const [hasMore, setHasMore] = useState(initialHasMore ?? false)
  const [page, setPage] = useState(1)
  const skipInitialFetch = useRef(initialData !== undefined)
  const gridRef = useRef<HTMLDivElement>(null)

  const loadFamiliesData = useCallback(
    async (pageNumber: number, limit: number, isAppend: boolean) => {
      setIsLoading(true)
      setIsError(false)

      try {
        const res = await fetch(
          `/api/families?page=${pageNumber}&limit=${limit}`,
        )
        if (!res.ok) throw new Error('fetch failed')
        const result = (await res.json()) as FamilyResponse

        if (result.success && result.data) {
          setHasMore(result.hasNextPage ?? false)
          if (isAppend) {
            setFamilies((prev) => [...prev, ...result.data])
          } else {
            setFamilies(result.data)
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
    loadFamiliesData(1, ITEMS_PER_LOAD, false)
  }, [loadFamiliesData])

  const prevCountRef = useRef(0)

  // Staggered scroll-triggered card entrance
  useGSAP(
    () => {
      if (!gridRef.current || families.length === 0) return

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const allCards = gsap.utils.toArray<HTMLElement>('.family-card')
        const newCards = allCards.slice(prevCountRef.current)

        if (newCards.length === 0) return

        gsap.set(newCards, { y: 40, opacity: 0 })

        ScrollTrigger.batch(newCards, {
          start: 'top 90%',
          onEnter: (batch) => {
            gsap.to(batch, {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.6,
              ease: 'power3.out',
              overwrite: true,
            })
          },
        })

        prevCountRef.current = allCards.length
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        const allCards = gsap.utils.toArray<HTMLElement>('.family-card')
        gsap.set(allCards, { y: 0, opacity: 1 })
        prevCountRef.current = allCards.length
      })
    },
    { scope: gridRef, dependencies: [families] },
  )

  const handleRetry = () => {
    setPage(1)
    loadFamiliesData(1, ITEMS_PER_LOAD, false)
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadFamiliesData(nextPage, ITEMS_PER_LOAD, true)
  }

  if (families.length === 0) {
    return (
      <div className="flex min-h-100 w-full flex-col items-center justify-center py-20 text-center">
        {isLoading ? (
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-(--primary-black)" />
            <p className="font-mono text-sm text-(--neutral-30)">
              Fetching families...
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
              No families yet
            </p>
            <p className="text-sm text-(--neutral-40)">
              Check back soon for new community families.
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div ref={gridRef} className="flex flex-col gap-12">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {families.map((family, index) => (
          <Link
            key={family.id}
            href={family.link || '#'}
            target={family.link ? '_blank' : undefined}
            rel={family.link ? 'noopener noreferrer' : undefined}
            className="family-card group relative flex h-full flex-col justify-between rounded-xl border-2 border-(--primary-black) bg-white p-6 shadow-[0_0_0_0_rgba(26,26,26,1)] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:-translate-y-2 hover:shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]"
            style={{
              ['--hover-rotate' as string]: `${index % 3 === 0 ? '-1' : index % 3 === 1 ? '0.5' : '1'}deg`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = `translateY(-8px) rotate(var(--hover-rotate))`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = ''
            }}
          >
            <div className="mb-5 flex items-start justify-between">
              <div className="relative h-14 w-30">
                {family.image ? (
                  <Image
                    src={family.image}
                    alt={family.name}
                    fill
                    className="object-contain object-left"
                    sizes="120px"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg border-2 border-(--primary-black) bg-(--khaki-80) text-xl font-black text-(--primary-black)">
                    {family.name.charAt(0)}
                  </div>
                )}
              </div>
              <ExternalLink className="h-5 w-5 text-(--primary-black) opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            <h3 className="mb-2 text-xl font-black tracking-tight text-(--primary-black) uppercase">
              {family.name}
            </h3>
            <p className="mb-6 line-clamp-3 text-sm leading-relaxed font-medium text-(--neutral-30)">
              {family.description}
            </p>

            <div className="mt-auto flex flex-wrap gap-2">
              <span className="rounded-full border-2 border-(--primary-black) bg-[#ccf281] px-3 py-1 text-xs font-bold tracking-wider text-(--primary-black) uppercase transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105">
                {family.tags}
              </span>
            </div>
          </Link>
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
    </div>
  )
}
