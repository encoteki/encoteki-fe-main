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
  const drawable = generator.rectangle(
    2,
    2,
    SKETCH_VIEW_WIDTH - 4,
    SKETCH_VIEW_HEIGHT - 4,
    {
      stroke: '#1a1a1a',
      strokeWidth: 2.4,
      roughness: 1.6,
      bowing: 1,
      disableMultiStroke: true,
      seed,
    },
  )
  const { d: strokeD, strokeWidth } = generator.toPaths(drawable)[0]

  // The visible border is 4 open "M..C.." subpaths (one per side) that
  // don't quite meet at the corners — deliberate, for the hand-drawn line.
  // The clip region must be the *exact same* geometry, or the cover art
  // either falls short of the ink line (visible background gap) or spills
  // past it (the earlier overflow bug) — so it's derived from this same
  // string rather than drawn as a second, independently wobbly shape:
  // every subsequent "M" becomes a straight "L" bridging that small
  // hand-drawn gap, and the loop is closed back to the start.
  const clipD = `${strokeD.replace(/ M/g, ' L')} Z`

  return { strokeD, clipD, strokeWidth }
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
          <li key={chapter.slug}>
            {/* Visually hidden so heading navigation still finds each
                chapter; the row's own accessible name (below) carries the
                same text for direct interaction. */}
            <h3 className="sr-only">
              Chapter {chapter.number}: {chapter.title}
            </h3>
            {/* The whole row — numeral and cover art alike — is one real
                button. It used to be a stretched ::after pseudo-element
                sized to the row, which a sibling positioned element (the
                image wrapper) could shadow and swallow clicks from; a
                single button has no such gap. */}
            <button
              type="button"
              onClick={() => onSelect(chapter)}
              disabled={chapter.locked}
              aria-label={
                chapter.locked
                  ? `Chapter ${chapter.number}: ${chapter.title} — coming soon`
                  : `Chapter ${chapter.number}: ${chapter.title}`
              }
              className="group flex w-full cursor-pointer flex-col items-stretch gap-2 py-6 text-left transition-colors duration-200 outline-none hover:bg-(--khaki-80) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary-black) disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent sm:flex-row sm:gap-8 sm:py-8"
            >
              {/* Stacked above the image at narrow widths instead of
                  sharing a row with it — a fixed side column at any width
                  narrow enough to matter would either overflow this
                  numeral's display size or squeeze the cover art into a
                  sliver; full width lets the numeral breathe and leaves the
                  image its own full-width row underneath. */}
              <span className="flex w-full items-center justify-center py-1 sm:w-56 sm:shrink-0 sm:py-0">
                <span
                  aria-hidden="true"
                  className="text-5xl leading-none font-black text-white uppercase [-webkit-text-stroke:2.5px_var(--primary-black)] [paint-order:stroke_fill] sm:text-8xl sm:[-webkit-text-stroke:4px_var(--primary-black)]"
                >
                  #{chapter.number}
                </span>
              </span>

              <span className="relative aspect-3/1 w-full flex-1">
                {/* Hand-drawn panel: the cover art is clipped to the same
                    wobbly rectangle the visible border traces, so the
                    artwork reads as sitting inside the sketch rather than
                    overflowing (or falling short of) a straight-edged box
                    underneath it. A deliberate departure from the site's
                    ruled brutalist borders, matching the stakeholder's
                    webcomic-index reference — scoped to this surface only. */}
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
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
