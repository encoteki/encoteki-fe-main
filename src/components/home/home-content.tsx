import dynamic from 'next/dynamic'
import Hero from '@/components/home/hero'

// Below-fold sections: dynamically imported to reduce initial JS bundle & TBT
const Collections = dynamic(() => import('./collections'))
const Benefits = dynamic(() => import('@/components/home/benefits'))
const About = dynamic(() => import('@/components/home/about'))
const Roadmap = dynamic(() => import('@/components/home/roadmap'))
const FamilyGallery = dynamic(() => import('./family'))
const FAQ = dynamic(() => import('@/components/home/faq'))

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
