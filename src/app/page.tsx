import React from 'react'
import dynamic from 'next/dynamic'
import { Footer } from '@/components/Footer'
import Loading from './loading'
import ReactLenis from 'lenis/react'

const HomeContent = dynamic(() => import('@/components/home/HomeContent'), {
  ssr: true,
  loading: () => <Loading />,
})

type SectionConfig = {
  id: string
  component: React.ComponentType
}

const HOME_SECTIONS: SectionConfig[] = [
  {
    id: 'main-content',
    component: HomeContent,
  },
  {
    id: 'footer',
    component: Footer,
  },
]

export default function Home() {
  return (
    <ReactLenis root>
      {HOME_SECTIONS.map(({ id, component: Component }) => (
        <section key={id}>
          <Component />
        </section>
      ))}
    </ReactLenis>
  )
}
