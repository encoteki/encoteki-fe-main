import PartnersGrid from '@/components/partners/partners-grid'

export default function PartnerDealsPage() {
  return (
    <main className="partner-container bg-(--khaki-90)">
      <header className="mb-12 max-w-2xl">
        <h1 className="text-5xl font-medium text-[#1a1a1a] md:text-6xl">
          Partner Deals,{' '}
          <span className="font-serif text-gray-500 italic">Curated.</span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-gray-800">
          We selected some exclusive perks we think would be a{' '}
          <span className="font-serif text-gray-600 italic">good fit</span> for
          you. Enjoy special privileges only for Encoteki holders.
        </p>
      </header>

      <PartnersGrid />
    </main>
  )
}
