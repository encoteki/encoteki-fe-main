import FamilyGrid from '@/components/family/family-grid'

export default function FamilyPage() {
  return (
    <main className="partner-container bg-(--khaki-90)">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 max-w-2xl">
          <h1 className="text-5xl font-medium text-[#1a1a1a] md:text-6xl">
            Our Family,{' '}
            <span className="font-serif text-gray-500 italic">United.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-800">
            Collaborations designed to empower our holders. We curated these{' '}
            <span className="font-serif text-gray-600 italic">
              strategic perks
            </span>{' '}
            to bring real-world value and utility to your journey with us.
          </p>
        </header>

        <FamilyGrid />
      </div>
    </main>
  )
}
