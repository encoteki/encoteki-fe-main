'use client'

import { useRef, useState } from 'react'
import posthog from 'posthog-js'
import { STORY_CHAPTERS, type StoryChapter } from '@/lib/story/content'
import StoryList from '@/components/story/story-list'
import StoryBookModal from '@/components/story/story-book-modal'
import PageHeader from '@/ui/page-header'

export default function StoryPage() {
  const [selected, setSelected] = useState<StoryChapter | null>(null)
  const lastTriggerRef = useRef<HTMLElement | null>(null)

  function handleSelect(chapter: StoryChapter) {
    posthog.capture('story_row_selected', { chapter_slug: chapter.slug })
    lastTriggerRef.current = document.activeElement as HTMLElement
    setSelected(chapter)
  }

  return (
    <main className="partner-container bg-(--khaki-90)">
      <div className="mx-auto max-w-4xl">
        <PageHeader
          heading={
            <>
              Meet the{' '}
              <span className="font-serif text-(--neutral-40) italic">
                Satwas Band
              </span>
            </>
          }
          description="One story, five chapters. The Satwas Band is inspired by real endangered Indonesian animals — pick a chapter to read how they came together."
        />
        <StoryList chapters={STORY_CHAPTERS} onSelect={handleSelect} />
      </div>

      <StoryBookModal
        chapter={selected}
        isOpen={selected !== null}
        onCloseAction={() => {
          setSelected(null)
          lastTriggerRef.current?.focus()
        }}
      />
    </main>
  )
}
