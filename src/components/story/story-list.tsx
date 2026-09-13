'use client'

import { useMemo } from 'react'
import rough from 'roughjs'
import type { StoryChapter } from '@/lib/story/content'

// Fixed drawing surface for the sketch-border overlay. The <svg> stretches
// this viewBox to whatever the banner actually renders at (preserveAspectRatio
// "none"), so the hand-drawn wobble is computed once, not on every resize.
const SKETCH_VIEW_WIDTH = 300
const SKETCH_VIEW_HEIGHT = 100

const generator = rough.generator()

function sketchBorder(seed: number) {
  // One rectangle draw produces two paths: an open, stroked outline (the
  // visible ink border) and — because fillStyle is "solid" — a separate
  // closed polygon tracing roughly the same wobbly boundary. The closed one
  // isn't rendered directly; it's reused below as a clip-path so the cover
  // art is cropped to the hand-drawn shape instead of sitting as a full
  // rectangle with a border merely drawn on top of it (which let the image
  // show past the border wherever the line wobbled inward).
  const drawable = generator.rectangle(
    2,
    2,
    SKETCH_VIEW_WIDTH - 4,
    SKETCH_VIEW_HEIGHT - 4,
    {
      stroke: '#1a1a1a',
      strokeWidth: 3.2,
      roughness: 1.6,
      bowing: 1,
      disableMultiStroke: true,
      fill: '#000',
      fillStyle: 'solid',
      seed,
    },
  )
  const paths = generator.toPaths(drawable)
  const strokePath = paths.find((p) => p.fill === 'none')
  const clipPath = paths.find((p) => p.stroke === 'none')
  return {
    strokeD: strokePath?.d ?? '',
    strokeWidth: strokePath?.strokeWidth ?? 3.2,
    clipD: clipPath?.d ?? '',
  }
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
  const sketches = useMemo(
    () =>
      new Map(
        chapters.map((chapter) => [
          chapter.slug,
          sketchBorder(chapter.number * 97 + 13),
        ]),
      ),
    [chapters],
  )

  return (
    <ul className="flex flex-col divide-y divide-(--neutral-40)">
      {chapters.map((chapter) => {
        const sketch = sketches.get(chapter.slug)
        const clipId = `story-clip-${chapter.slug}`

        return (
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
                {/* Hand-drawn panel: the cover art is clipped to the same
                    wobbly rectangle the visible border traces, so the
                    artwork reads as sitting inside the sketch rather than
                    overflowing a straight-edged box underneath it. A
                    deliberate departure from the site's ruled brutalist
                    borders, matching the stakeholder's webcomic-index
                    reference — scoped to this surface only. */}
                <svg
                  aria-hidden="true"
                  viewBox={`0 0 ${SKETCH_VIEW_WIDTH} ${SKETCH_VIEW_HEIGHT}`}
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                >
                  <defs>
                    <clipPath id={clipId}>
                      <path d={sketch?.clipD} />
                    </clipPath>
                  </defs>
                  <image
                    href={chapter.cover.image.src}
                    x={0}
                    y={0}
                    width={SKETCH_VIEW_WIDTH}
                    height={SKETCH_VIEW_HEIGHT}
                    preserveAspectRatio="xMidYMid slice"
                    clipPath={`url(#${clipId})`}
                  />
                  <path
                    d={sketch?.strokeD}
                    fill="none"
                    stroke="#1a1a1a"
                    strokeWidth={sketch?.strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
