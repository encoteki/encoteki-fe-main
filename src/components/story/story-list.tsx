'use client'

import type { StoryCharacter } from '@/lib/story/content'

export default function StoryList({
  characters,
  onSelect,
}: {
  characters: StoryCharacter[]
  onSelect: (character: StoryCharacter) => void
}) {
  return (
    <div className="flex flex-col divide-y divide-(--neutral-60)">
      {characters.map((character) => (
        <button
          key={character.slug}
          type="button"
          onClick={() => onSelect(character)}
          className="group flex flex-col gap-4 py-6 text-left transition-colors duration-200 hover:bg-(--khaki-80) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary-black) sm:flex-row sm:items-center sm:gap-8 sm:py-8"
        >
          <div className="flex shrink-0 items-center gap-4 sm:w-52">
            <span
              className="flex h-14 w-14 shrink-0 -rotate-2 items-center justify-center rounded-lg text-xs font-black tracking-tight text-(--primary-black) uppercase transition-transform duration-200 group-hover:rotate-0"
              style={{ backgroundColor: character.badgeColor }}
            >
              {character.badgeInitials}
            </span>
            <div className="min-w-0">
              <h3 className="text-lg font-black tracking-tight text-(--primary-black) uppercase">
                {character.name}
              </h3>
              <p className="text-xs text-(--neutral-30)">{character.role}</p>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="aspect-3/1 w-full flex-1 rounded-md border border-(--neutral-60) sm:aspect-4/1"
            style={{ backgroundColor: character.bannerPlaceholderColor }}
          />
        </button>
      ))}
    </div>
  )
}
