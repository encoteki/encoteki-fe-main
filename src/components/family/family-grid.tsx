'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import posthog from 'posthog-js'

import { Family } from '@/types/family.type'
import {
  usePaginatedGrid,
  GridStatus,
  LoadMoreButton,
} from '@/ui/paginated-grid'

const ITEMS_PER_LOAD = 9

interface FamilyGridProps {
  initialData?: Family[]
  initialHasMore?: boolean
}

export default function FamilyGrid({
  initialData,
  initialHasMore,
}: FamilyGridProps) {
  const {
    items: families,
    isLoading,
    isError,
    hasMore,
    gridRef,
    handleRetry,
    handleLoadMore,
  } = usePaginatedGrid<Family>({
    endpoint: '/api/families',
    itemsPerLoad: ITEMS_PER_LOAD,
    initialData,
    initialHasMore,
    loadMoreEvent: 'families_load_more_clicked',
    cardSelector: '.family-card',
    reveal: { y: 40, start: 'top 90%', stagger: 0.08, duration: 0.6 },
  })

  if (families.length === 0) {
    return (
      <GridStatus
        isLoading={isLoading}
        isError={isError}
        onRetry={handleRetry}
        loadingLabel="Fetching families..."
        emptyTitle="No families yet"
        emptyDescription="Check back soon for new community families."
      />
    )
  }

  return (
    <div ref={gridRef} className="flex flex-col gap-12">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {families.map((family, index) => {
          const cardClassName =
            'family-card group relative flex h-full flex-col justify-between rounded-xl border-2 border-(--primary-black) bg-white p-6 shadow-[0_0_0_0_rgba(26,26,26,1)] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:-translate-y-2 hover:shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]'
          const cardStyle = {
            ['--hover-rotate' as string]: `${index % 3 === 0 ? '-1' : index % 3 === 1 ? '0.5' : '1'}deg`,
          }
          const hoverHandlers = {
            onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
              e.currentTarget.style.transform = `translateY(-8px) rotate(var(--hover-rotate))`
            },
            onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
              e.currentTarget.style.transform = ''
            },
          }

          const cardInner = (
            <>
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
                {family.link && (
                  <ExternalLink className="h-5 w-5 text-(--primary-black) opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                )}
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
            </>
          )

          return family.link ? (
            <Link
              key={family.id}
              href={family.link}
              target="_blank"
              rel="noopener noreferrer"
              className={cardClassName}
              style={cardStyle}
              onClick={() =>
                posthog.capture('family_card_clicked', {
                  family_id: family.id,
                  family_name: family.name,
                  tags: family.tags,
                })
              }
              {...hoverHandlers}
            >
              {cardInner}
            </Link>
          ) : (
            <div
              key={family.id}
              className={cardClassName}
              style={cardStyle}
              {...hoverHandlers}
            >
              {cardInner}
            </div>
          )
        })}
      </div>

      {hasMore && (
        <LoadMoreButton isLoading={isLoading} onClick={handleLoadMore} />
      )}
    </div>
  )
}
