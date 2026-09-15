'use client'

import VerticalMarquee from '@/ui/vertical-marquee'

// The vertically-scrolling card gallery used to live nested inside
// Collections (below Hero); split out so it can sit as its own section
// directly under Hero, independent of the Collections heading/CTA copy.
export default function CollectionsGallery() {
  return (
    <section className="home-container bg-(--khaki-90)">
      <div className="h-[450px] w-full bg-(--khaki-90) md:h-150">
        <VerticalMarquee />
      </div>
    </section>
  )
}
