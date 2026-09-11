'use client'

import { useState } from 'react'
import posthog from 'posthog-js'
import { STORY_CHARACTERS, type StoryCharacter } from '@/lib/story/content'
import StoryList from '@/components/story/story-list'
import StoryBookModal from '@/components/story/story-book-modal'
import PageHeader from '@/ui/page-header'

export default function StoryPage() {
  const [selected, setSelected] = useState<StoryCharacter | null>(null)

  function handleSelect(character: StoryCharacter) {
    posthog.capture('story_row_selected', { character_slug: character.slug })
    setSelected(character)
  }

  return (
    <main className="partner-container bg-(--khaki-90)">
      <div className="mx-auto max-w-4xl">
        <PageHeader
          heading={
            <>
              Meet the Band,{' '}
              <span className="font-serif text-(--neutral-40) italic">
                Teki.
              </span>
            </>
          }
          description="Six voices, six stories. The Satwas Band is inspired by real endangered Indonesian animals — tap a name to read their story."
        />
        <StoryList characters={STORY_CHARACTERS} onSelect={handleSelect} />
      </div>

      <StoryBookModal
        character={selected}
        isOpen={selected !== null}
        onCloseAction={() => setSelected(null)}
      />
    </main>
  )
}
