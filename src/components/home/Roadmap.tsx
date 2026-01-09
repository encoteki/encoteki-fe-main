'use client'

import SectionHeading from '@/ui/text/SectionHeading'
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

const services = [
  {
    id: 1,
    title: 'Genesis & Launch',
    description:
      "Establishing the ecosystem's foundation through platform deployment, strategic alliances, and the debut of exclusive physical collectibles.",
    theme: 'foundation',
    color: '#FFD94A',
  },
  {
    id: 2,
    title: 'Expansion',
    description:
      'Scaling the ecosystem by enhancing digital utility, fostering community through local collaborations, and laying the groundwork for subsidiaries.',
    theme: 'scaling',
    color: '#60A5FA',
  },
  {
    id: 3,
    title: 'Maturity & Impact',
    description:
      'Solidifying the ecosystem structure through the official launch of subsidiaries and evolved NFT utility, while driving tangible change via community projects.',
    theme: 'structure',
    color: '#E9D5FF',
  },
  {
    id: 4,
    title: 'Legacy',
    description:
      'Expanding boundaries through a fully immersive Metaverse presence and a specialized educational platform, culminating in full DAO governance.',
    theme: 'metaverse',
    color: '#FB7185',
  },
]

export default function Roadmap() {
  return (
    <section className="home-container min-h-screen bg-(--khaki-90) py-16 md:py-24 lg:py-32">
      <div className="mb-12 px-4 pb-8 text-center md:mb-16 lg:mb-24">
        <SectionHeading
          title="Roadmap"
          desc="The blueprint of our sustainable growth ahead"
          className="text-4xl font-black md:text-6xl lg:text-7xl"
          align="center"
        />
      </div>

      <ServicesHover />
    </section>
  )
}

function ServicesHover() {
  const [activeService, setActiveService] = useState(services[0])

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 gap-8 md:gap-12 xl:grid-cols-12 xl:gap-8">
        <div className="flex w-full flex-col xl:col-span-5">
          <div className="border-t-2 border-black md:border-t-4">
            {services.map((service) => {
              const isActive = activeService.id === service.id

              return (
                <div
                  key={service.id}
                  onClick={() => setActiveService(service)}
                  onMouseEnter={() => setActiveService(service)}
                  style={{
                    backgroundColor: isActive ? service.color : 'transparent',
                  }}
                  className={`group relative cursor-pointer border-b-4 border-black py-5 pl-0 transition-all duration-200 hover:border-black hover:pl-2 md:py-8 md:hover:pl-6 lg:py-10 xl:hover:pl-4 ${
                    isActive
                      ? 'border-l-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] xl:translate-x-2.5 xl:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
                      : 'hover:bg-black/5'
                  } `}
                >
                  {/* Header Item */}
                  <div className="flex items-center justify-between px-3 md:px-6 xl:px-4">
                    <h3
                      className={`flex items-baseline text-xl font-black tracking-tight uppercase transition-colors duration-200 md:text-4xl lg:text-5xl xl:text-4xl ${isActive ? 'text-black' : 'text-black'} `}
                    >
                      {/* Number Badge */}
                      <span
                        className={`mr-3 border-2 border-black px-1.5 py-0.5 font-mono text-sm transition-colors md:mr-6 md:px-3 md:py-1 md:text-xl ${
                          isActive
                            ? 'bg-black text-white'
                            : 'bg-transparent text-black/50'
                        } `}
                      >
                        0{service.id}
                      </span>
                      {service.title}
                    </h3>

                    {/* Arrow Icon */}
                    <div
                      className={`transition-all duration-200 ${
                        isActive
                          ? 'translate-x-0 opacity-100'
                          : '-translate-x-2 opacity-0 md:-translate-x-4 xl:translate-x-0 xl:opacity-100'
                      }`}
                    >
                      <div
                        className={`/* Icon Box Size */ /* Mobile */ /* Tablet+ */ /* Desktop Split */ flex h-8 w-8 items-center justify-center border-2 border-black transition-colors duration-200 md:h-12 md:w-12 xl:h-10 xl:w-10 ${
                          isActive
                            ? 'bg-black'
                            : 'bg-transparent group-hover:bg-black'
                        } `}
                      >
                        <ArrowRight
                          strokeWidth={3}
                          className={`/* Mobile Icon */ /* Tablet Icon */ h-4 w-4 transition-transform duration-200 md:h-6 md:w-6 ${
                            isActive
                              ? 'rotate-90 text-white xl:rotate-0'
                              : 'text-black group-hover:text-white'
                          } `}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Accordion Content (Visible on Mobile, Tablet, Laptop | Hidden on XL Desktop) */}
                  <div
                    className={`grid overflow-hidden transition-all duration-300 ease-linear xl:hidden ${
                      isActive
                        ? 'mt-4 grid-rows-[1fr] opacity-100 md:mt-8'
                        : 'mt-0 grid-rows-[0fr] opacity-0'
                    } `}
                  >
                    <div className="min-h-0 px-3 pb-2 md:px-6 md:pb-4">
                      <div
                        className="border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:p-8 md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] lg:p-10 lg:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"
                        style={{ backgroundColor: service.color }}
                      >
                        <h4 className="mb-2 inline-block border-b-2 border-black font-black uppercase md:mb-4 md:text-2xl lg:text-3xl">
                          Mission Brief:
                        </h4>
                        <p className="font-mono text-sm leading-relaxed font-normal text-black md:text-xl md:leading-loose lg:text-2xl">
                          <span className="mr-2 font-black md:mr-4">&gt;</span>
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* --- RIGHT COLUMN: TEXT BOX AREA (Desktop XL Only) --- */}
        <div className="hidden w-full pl-12 xl:col-span-7 xl:flex xl:flex-col">
          <div
            className="flex h-full w-full flex-col justify-center border-4 border-black p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300"
            style={{ backgroundColor: activeService.color }}
          >
            <div>
              <h4 className="mb-6 inline-block self-start border-b-4 border-black pb-4 text-3xl font-black tracking-tighter uppercase">
                PHASE 0{activeService.id} DETAILS:
              </h4>
            </div>

            <p
              key={activeService.id}
              className="animate-in fade-in slide-in-from-bottom-4 font-mono text-2xl leading-relaxed text-black"
            >
              <span className="mr-3 text-4xl font-black">&gt;</span>
              {activeService.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
