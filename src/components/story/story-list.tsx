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
    <ul className="flex flex-col divide-y divide-(--neutral-40)">
      {characters.map((character) => (
        <li key={character.slug} className="relative">
          <div className="group flex flex-col gap-4 py-6 transition-colors duration-200 hover:bg-(--khaki-80) has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--primary-black) sm:flex-row sm:items-center sm:gap-8 sm:py-8">
            <div className="flex shrink-0 items-center gap-4 sm:w-52">
              <span
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 -rotate-2 items-center justify-center rounded-lg text-xs font-black tracking-tight text-(--primary-black) uppercase transition-transform duration-200 group-hover:rotate-0"
                style={{ backgroundColor: character.badgeColor }}
              >
                {character.badgeInitials}
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-black tracking-tight text-(--primary-black) uppercase">
                  <button
                    type="button"
                    onClick={() => onSelect(character)}
                    className="cursor-pointer outline-none after:absolute after:inset-0 after:content-['']"
                  >
                    {character.name}
                  </button>
                </h3>
                <p className="text-xs text-(--neutral-30)">{character.role}</p>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="aspect-3/1 w-full flex-1 rounded-md border border-(--neutral-60) sm:aspect-4/1"
              style={{ backgroundColor: character.bannerPlaceholderColor }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
