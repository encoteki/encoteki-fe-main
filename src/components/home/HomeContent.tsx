import Hero from '@/components/home/Hero'
import Benefits from '@/components/home/Benefits'
import About from '@/components/home/About'
import FAQ from '@/components/home/FAQ'
import Roadmap from '@/components/home/Roadmap'
import Header from '../Header'
import Collections from './Collections'
import FamilyGallery from './FamilyGallery'

export default function HomeContent() {
  return (
    <>
      <Header />
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
