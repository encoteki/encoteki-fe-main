'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import rough from 'roughjs'
import type { StoryChapter } from '@/lib/story/content'

// Fixed drawing surface for the sketch-border overlay. The <svg> stretches
// this viewBox to whatever the banner actually renders at (preserveAspectRatio
// "none"), so the hand-drawn wobble is computed once, not on every resize.
const SKETCH_VIEW_WIDTH = 300
const SKETCH_VIEW_HEIGHT = 100

const generator = rough.generator()

function sketchBorderPaths(seed: number) {
  const drawable = generator.rectangle(
    4,
    4,
    SKETCH_VIEW_WIDTH - 8,
    SKETCH_VIEW_HEIGHT - 8,
    {
      stroke: '#1a1a1a',
      strokeWidth: 3.6,
      roughness: 1.6,
      bowing: 1,
      disableMultiStroke: true,
      seed,
    },
  )
  return generator.toPaths(drawable)
}

export default function StoryList({
  chapters,
  onSelect,
}: {
  chapters: StoryChapter[]
  onSelect: (chapter: StoryChapter) => void
}) {
  // Deterministic per-chapter seed (not Math.random(), which would draw a
  // different wobble on the server than on the client and break hydration).
  const sketchBorders = useMemo(
    () =>
      new Map(
        chapters.map((chapter) => [
          chapter.slug,
          sketchBorderPaths(chapter.number * 97 + 13),
        ]),
      ),
    [chapters],
  )

  return (
    <ul className="flex flex-col divide-y divide-(--neutral-40)">
      {chapters.map((chapter) => (
        <li key={chapter.slug} className="relative">
          <div className="group flex flex-col gap-4 py-6 transition-colors duration-200 hover:bg-(--khaki-80) has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--primary-black) sm:flex-row sm:items-center sm:gap-8 sm:py-8">
            <div className="flex shrink-0 items-center gap-4 sm:w-56">
              <span
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 -rotate-2 items-center justify-center rounded-lg text-xs font-black tracking-tight text-(--primary-black) uppercase transition-transform duration-200 group-hover:rotate-0"
                style={{ backgroundColor: chapter.badgeColor }}
              >
                CH{chapter.number}
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-black tracking-tight text-(--primary-black) uppercase">
                  <button
                    type="button"
                    onClick={() => onSelect(chapter)}
                    className="cursor-pointer outline-none after:absolute after:inset-0 after:content-['']"
                  >
                    {chapter.title}
                  </button>
                </h3>
                <p className="text-xs text-(--neutral-30)">
                  {chapter.characters}
                </p>
              </div>
            </div>

            <div className="relative aspect-3/1 w-full flex-1 sm:aspect-4/1">
              <Image
                src={chapter.cover.image}
                alt=""
                aria-hidden="true"
                fill
                sizes="(min-width: 640px) 500px, 100vw"
                className="object-cover"
              />
              {/* Hand-drawn panel border — a deliberate departure from the
                  site's ruled brutalist borders, matching the stakeholder's
                  webcomic-index reference (each panel inked free-hand, not
                  ruler-straight). Scoped to this surface only. */}
              <svg
                aria-hidden="true"
                viewBox={`0 0 ${SKETCH_VIEW_WIDTH} ${SKETCH_VIEW_HEIGHT}`}
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              >
                {sketchBorders.get(chapter.slug)?.map((path, i) => (
                  <path
                    key={i}
                    d={path.d}
                    fill="none"
                    stroke={path.stroke}
                    strokeWidth={path.strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
              </svg>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
