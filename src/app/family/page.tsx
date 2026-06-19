export const dynamic = 'force-dynamic'

import { fetchFamilies } from '@/lib/data/family'
import FamilyGrid from '@/components/family/family-grid'
import PageHeader from '@/ui/page-header'

export default async function FamilyPage() {
  const result = await fetchFamilies(1, 9)

  return (
    <main className="partner-container bg-(--khaki-90)">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          heading={
            <>
              Our Family,{' '}
              <span className="font-serif text-(--neutral-40) italic">
                United.
              </span>
            </>
          }
          description="Communities we trust, building alongside us. Real partnerships, real value for holders."
        />
        <FamilyGrid
          initialData={result.success ? result.data : undefined}
          initialHasMore={result.hasNextPage ?? false}
        />
      </div>
    </main>
  )
}
