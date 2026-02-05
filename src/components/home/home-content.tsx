import Hero from '@/components/home/hero'
import Benefits from '@/components/home/benefits'
import About from '@/components/home/about'
import FAQ from '@/components/home/faq'
import Roadmap from '@/components/home/roadmap'
import Collections from './collections'
import FamilyGallery from './family'

export default function HomeContent() {
  return (
    <>
      <Hero />
      <Collections />
      <Benefits />
      <About />
      <Roadmap />
      <FamilyGallery />
      <FAQ />
    </>
  )
}
