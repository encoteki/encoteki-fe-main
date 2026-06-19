export const dynamic = 'force-dynamic'

import { fetchPartners } from '@/lib/data/partner'
import PartnersGrid from '@/components/partners/partners-grid'
import PageHeader from '@/ui/page-header'

export default async function PartnerDealsPage() {
  const result = await fetchPartners(1, 12)

  return (
    <main className="partner-container bg-(--khaki-90)">
      <PageHeader
        heading={
          <>
            Partner Deals,{' '}
            <span className="font-serif text-(--neutral-40) italic">
              Curated.
            </span>
          </>
        }
        description="Exclusive perks for Encoteki holders. Real discounts, real partners, no fluff."
      />
      <PartnersGrid
        initialData={result.success ? result.data : undefined}
        initialHasMore={result.hasNextPage ?? false}
      />
    </main>
  )
}
