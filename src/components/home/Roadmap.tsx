'use client'

import SectionHeading from '@/ui/text/SectionHeading'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

// Image
import Phase1 from '@/assets/roadmap/phase-1.png'
import Phase2 from '@/assets/roadmap/phase-2.png'
import Phase3 from '@/assets/roadmap/phase-3.png'
import Phase4 from '@/assets/roadmap/phase-4.png'

const services = [
  {
    id: 1,
    title: 'Genesis & Launch',
    description:
      "Establishing the ecosystem's foundation through platform deployment, strategic alliances, and the debut of exclusive physical collectibles alongside our inaugural social impact initiative.",
    image: Phase1,
  },
  {
    id: 2,
    title: 'Expansion',
    description:
      'Scaling the ecosystem by enhancing digital utility, fostering community through local collaborations, and laying the groundwork for subsidiaries and deeper strategic alliances.',
    image: Phase2,
  },
  {
    id: 3,
    title: 'Maturity & Impact',
    description:
      'Solidifying the ecosystem structure through the official launch of subsidiaries and evolved NFT utility, while driving tangible change via impactful community projects and high-value individual partnerships.',
    image: Phase3,
  },
  {
    id: 4,
    title: 'Legacy',
    description:
      'Expanding boundaries through a fully immersive Metaverse presence and a specialized educational platform for Indonesia, culminating in the transition to full community governance via a DAO.',
    image: Phase4,
  },
]

export default function Roadmap() {
  return (
    <section className="home-container min-h-screen bg-(--khaki-90)">
      <SectionHeading
        title="Roadmap"
        desc="This roadmap is the blueprint of our sustainable growth ahead"
        className="mb-12 lg:mb-20"
        align="center"
      />

      <ServicesHover />
    </section>
  )
}

function ServicesHover() {
  const [activeService, setActiveService] = useState(services[0])

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-12">
      <div className="grid grid-cols-1 gap-12 xl:grid-cols-2 xl:items-center">
        {/* --- LEFT COLUMN: MENU LIST --- */}
        <div className="flex w-full flex-col">
          {services.map((service) => {
            const isActive = activeService.id === service.id

            return (
              <div
                key={service.id}
                onClick={() => setActiveService(service)}
                onMouseEnter={() => setActiveService(service)}
                className={`group cursor-pointer border-b border-gray-800 py-6 transition-all duration-300 md:py-8 ${
                  isActive ? 'border-gray-600' : 'border-gray-800'
                }`}
              >
                {/* Header Item */}
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-2xl font-medium transition-colors duration-300 md:text-4xl lg:text-5xl ${
                      isActive ? 'text-black' : 'text-black/20'
                    }`}
                  >
                    <span className="mr-2 align-top text-sm opacity-50 md:text-lg lg:text-xl">
                      0{service.id}
                    </span>
                    {service.title}
                  </h3>

                  <div
                    className={`transition-all duration-300 ${
                      isActive
                        ? 'translate-x-0 opacity-100'
                        : '-translate-x-4 opacity-0 xl:translate-x-0 xl:opacity-0'
                    }`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full md:h-10 md:w-10 xl:border-none xl:bg-transparent">
                      <ArrowRight
                        className={`h-4 w-4 text-black md:h-5 md:w-5 ${
                          isActive ? '-rotate-45 xl:rotate-0' : ''
                        } transition-transform`}
                      />
                    </div>
                  </div>
                </div>

                {/* --- ACCORDION CONTENT (Visible < XL) --- */}
                <div
                  className={`grid overflow-hidden transition-all duration-500 ease-in-out xl:hidden ${
                    isActive
                      ? 'mt-6 grid-rows-[1fr] opacity-100'
                      : 'mt-0 grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="min-h-0 space-y-4">
                    <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-900 sm:h-64 lg:h-80">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-base leading-relaxed text-black md:text-lg">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* --- RIGHT COLUMN: PREVIEW AREA (Visible >= XL only) --- */}
        <div className="sticky top-20 hidden h-[500px] w-full flex-col justify-between xl:flex">
          {/* Image Container */}
          <div className="relative h-[400px] w-full overflow-hidden rounded-xl bg-gray-900 shadow-2xl">
            {services.map((service) => (
              <div
                key={service.id}
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                  activeService.id === service.id
                    ? 'z-10 opacity-100'
                    : 'z-0 opacity-0'
                }`}
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="transform object-cover object-top transition-transform duration-700"
                  priority={service.id === 1}
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            ))}
          </div>

          {/* Description Text (Desktop) */}
          <div className="mt-8">
            <p
              className="animate-in fade-in slide-in-from-bottom-4 text-xl leading-relaxed text-black transition-all duration-300"
              key={activeService.id}
            >
              {activeService.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
