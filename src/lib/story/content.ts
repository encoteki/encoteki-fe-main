export type CharacterSlug =
  | 'tiggy'
  | 'gajara'
  | 'owen'
  | 'komesi'
  | 'cendry'
  | 'kanghoon'

export interface StoryPage {
  // Placeholder now (solid color) — swap to a real StaticImageData import
  // per page once art lands; the `caption` field stays as-is either way.
  placeholderColor: string
  caption: string
}

export interface StoryCharacter {
  slug: CharacterSlug
  name: string
  // Short badge code, styled like the reference's flat colorful logotype
  // badges — distinct per row.
  badgeInitials: string
  badgeColor: string
  role: string
  // Placeholder now — swap to a real StaticImageData import once the
  // banner art lands.
  bannerPlaceholderColor: string
  pages: StoryPage[]
}

function placeholderPages(
  name: string,
  color: string,
  count: number,
): StoryPage[] {
  return Array.from({ length: count }, (_, i) => ({
    placeholderColor: color,
    caption: `Page ${i + 1} of ${name}'s story — replace with final caption and art.`,
  }))
}

export const STORY_CHARACTERS: StoryCharacter[] = [
  {
    slug: 'tiggy',
    name: 'Tiggy',
    badgeInitials: 'TGY',
    badgeColor: '#ffd94a',
    role: 'The Quiet Visionary',
    bannerPlaceholderColor: '#ffd94a',
    pages: placeholderPages('Tiggy', '#ffd94a', 4),
  },
  {
    slug: 'gajara',
    name: 'Gajara',
    badgeInitials: 'GJR',
    badgeColor: '#60a5fa',
    role: 'The Grounded Soul',
    bannerPlaceholderColor: '#60a5fa',
    pages: placeholderPages('Gajara', '#60a5fa', 4),
  },
  {
    slug: 'owen',
    name: 'Owen',
    badgeInitials: 'OWN',
    badgeColor: '#e9d5ff',
    role: 'The Dreamer',
    bannerPlaceholderColor: '#e9d5ff',
    pages: placeholderPages('Owen', '#e9d5ff', 4),
  },
  {
    slug: 'komesi',
    name: 'Komesi',
    badgeInitials: 'KMS',
    badgeColor: '#86efac',
    role: 'The Steady Encourager',
    bannerPlaceholderColor: '#86efac',
    pages: placeholderPages('Komesi', '#86efac', 4),
  },
  {
    slug: 'cendry',
    name: 'Cendry',
    badgeInitials: 'CDY',
    badgeColor: '#ff9ca6',
    role: 'The Fearless Leader',
    bannerPlaceholderColor: '#ff9ca6',
    pages: placeholderPages('Cendry', '#ff9ca6', 4),
  },
  {
    slug: 'kanghoon',
    name: 'Kanghoon',
    badgeInitials: 'KGH',
    badgeColor: '#ff9e00',
    role: 'The Spark',
    bannerPlaceholderColor: '#ff9e00',
    pages: placeholderPages('Kanghoon', '#ff9e00', 4),
  },
]
