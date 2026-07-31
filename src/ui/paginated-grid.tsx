'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Loader2, RefreshCw, ArrowDown } from 'lucide-react'
import gsap, { useGSAP, ScrollTrigger } from '@/lib/gsap'
import posthog from 'posthog-js'

interface PaginatedApiResponse<T> {
  success: boolean
  data: T[]
  hasNextPage?: boolean
}

interface RevealAnimationOptions {
  y: number
  start: string
  stagger: number
  duration: number
}

interface UsePaginatedGridOptions {
  endpoint: string
  itemsPerLoad: number
  initialData: unknown[] | undefined
  initialHasMore: boolean | undefined
  loadMoreEvent: string
  cardSelector: string
  reveal: RevealAnimationOptions
}

// Shared fetch/pagination/reveal-animation state machine behind both the
// family and partner grids: fetch-and-append pages from a paginated GET
// route, retry on error, and stagger-reveal newly appended cards on scroll
// (skipped entirely under prefers-reduced-motion). `cardSelector` and
// `reveal` let each grid keep its own per-card CSS class and animation feel;
// everything else about the two grids was previously identical.
export function usePaginatedGrid<T>({
  endpoint,
  itemsPerLoad,
  initialData,
  initialHasMore,
  loadMoreEvent,
  cardSelector,
  reveal,
}: UsePaginatedGridOptions) {
  const [items, setItems] = useState<T[]>((initialData as T[]) ?? [])
  const [isLoading, setIsLoading] = useState(initialData === undefined)
  const [isError, setIsError] = useState(false)
  const [hasMore, setHasMore] = useState(initialHasMore ?? false)
  const [page, setPage] = useState(1)
  const skipInitialFetch = useRef(initialData !== undefined)
  const gridRef = useRef<HTMLDivElement>(null)
  const prevCountRef = useRef(0)

  const loadData = useCallback(
    async (pageNumber: number, isAppend: boolean) => {
      setIsLoading(true)
      setIsError(false)

      try {
        const res = await fetch(
          `${endpoint}?page=${pageNumber}&limit=${itemsPerLoad}`,
        )
        if (!res.ok) throw new Error('fetch failed')
        const result = (await res.json()) as PaginatedApiResponse<T>

        if (result.success && result.data) {
          setHasMore(result.hasNextPage ?? false)
          setItems((prev) =>
            isAppend ? [...prev, ...result.data] : result.data,
          )
        }
      } catch {
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    },
    [endpoint, itemsPerLoad],
  )

  useEffect(() => {
    if (skipInitialFetch.current) return
    loadData(1, false)
  }, [loadData])

  // Staggered scroll-triggered card entrance
  useGSAP(
    () => {
      if (!gridRef.current || items.length === 0) return

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const allCards = gsap.utils.toArray<HTMLElement>(cardSelector)
        const newCards = allCards.slice(prevCountRef.current)

        if (newCards.length === 0) return

        gsap.set(newCards, { y: reveal.y, opacity: 0 })

        ScrollTrigger.batch(newCards, {
          start: reveal.start,
          onEnter: (batch) => {
            gsap.to(batch, {
              y: 0,
              opacity: 1,
              stagger: reveal.stagger,
              duration: reveal.duration,
              ease: 'power3.out',
              overwrite: true,
            })
          },
        })

        prevCountRef.current = allCards.length
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        const allCards = gsap.utils.toArray<HTMLElement>(cardSelector)
        gsap.set(allCards, { y: 0, opacity: 1 })
        prevCountRef.current = allCards.length
      })
    },
    { scope: gridRef, dependencies: [items] },
  )

  const handleRetry = () => {
    setPage(1)
    loadData(1, false)
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    posthog.capture(loadMoreEvent, {
      page: nextPage,
      loaded_count: items.length,
    })
    loadData(nextPage, true)
  }

  return {
    items,
    isLoading,
    isError,
    hasMore,
    gridRef,
    handleRetry,
    handleLoadMore,
  }
}

export function GridStatus({
  isLoading,
  isError,
  onRetry,
  loadingLabel,
  emptyTitle,
  emptyDescription,
}: {
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  loadingLabel: string
  emptyTitle: string
  emptyDescription: string
}) {
  return (
    <div className="flex min-h-100 w-full flex-col items-center justify-center py-20 text-center">
      {isLoading ? (
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-(--primary-black)" />
          <p className="font-mono text-sm text-(--neutral-30)">
            {loadingLabel}
          </p>
        </div>
      ) : isError ? (
        <button
          onClick={onRetry}
          className="group flex items-center gap-2 rounded-full border-2 border-(--primary-black) bg-white px-6 py-3 text-sm font-bold text-(--primary-black) shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:translate-y-0.5 hover:bg-[#ccf281] hover:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] active:translate-y-1 active:shadow-none"
        >
          <RefreshCw className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180" />
          Try Again
        </button>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="font-mono text-sm tracking-widest text-(--neutral-30) uppercase">
            {emptyTitle}
          </p>
          <p className="text-sm text-(--neutral-30)">{emptyDescription}</p>
        </div>
      )}
    </div>
  )
}

export function LoadMoreButton({
  isLoading,
  onClick,
}: {
  isLoading: boolean
  onClick: () => void
}) {
  return (
    <div className="flex justify-center pb-12">
      <button
        onClick={onClick}
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
  )
}
