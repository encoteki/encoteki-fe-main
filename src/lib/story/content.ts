import type { StaticImageData } from 'next/image'

import ch1Cover from '@/assets/story-chapters/ch1-cover.webp'
import ch1Page1 from '@/assets/story-chapters/ch1-page1.webp'
import ch1Page2 from '@/assets/story-chapters/ch1-page2.webp'
import ch1Page3 from '@/assets/story-chapters/ch1-page3.webp'
import ch2Cover from '@/assets/story-chapters/ch2-cover.webp'
import ch2Page1 from '@/assets/story-chapters/ch2-page1.webp'
import ch2Page2 from '@/assets/story-chapters/ch2-page2.webp'
import ch2Page3 from '@/assets/story-chapters/ch2-page3.webp'
import ch3Cover from '@/assets/story-chapters/ch3-cover.webp'
import ch3Page1 from '@/assets/story-chapters/ch3-page1.webp'
import ch3Page2 from '@/assets/story-chapters/ch3-page2.webp'
import ch3Page3 from '@/assets/story-chapters/ch3-page3.webp'
import ch4Cover from '@/assets/story-chapters/ch4-cover.webp'
import ch4Page1 from '@/assets/story-chapters/ch4-page1.webp'
import ch4Page2 from '@/assets/story-chapters/ch4-page2.webp'
import ch4Page3 from '@/assets/story-chapters/ch4-page3.webp'
import ch5Cover from '@/assets/story-chapters/ch5-cover.webp'
import ch5Page1 from '@/assets/story-chapters/ch5-page1.webp'
import ch5Page2 from '@/assets/story-chapters/ch5-page2.webp'
import ch5Page3 from '@/assets/story-chapters/ch5-page3.webp'

// The Satwas Band's story ships as one continuous 5-chapter comic (cover +
// 3 pages each), not six independent per-character arcs — each chapter
// brings one or two more bandmates into the story, converging into the
// full band by Chapter 5. Titles below are read directly off the comic
// pages themselves, not invented here.
export interface StoryPage {
  image: StaticImageData
  alt: string
}

export interface StoryChapter {
  slug: string
  number: number
  title: string
  characters: string
  cover: StoryPage
  pages: StoryPage[]
  locked?: boolean
}

// Chapter 5 publishes on its own schedule, separate from a code deploy —
// flip NEXT_PUBLIC_STORY_CHAPTER_5_ACTIVE to "true" in the environment to
// unlock it. Any other value (including unset) leaves it greyed out and
// unclickable in the list. NEXT_PUBLIC_ because STORY_CHAPTERS is imported
// by value into the client-rendered story page, not read server-side.
const CHAPTER_5_ACTIVE =
  process.env.NEXT_PUBLIC_STORY_CHAPTER_5_ACTIVE === 'true'

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    slug: 'the-ground-gives-way',
    number: 1,
    title: 'The Ground Gives Way',
    characters: 'Tiggy & Gajara',
    cover: {
      image: ch1Cover,
      alt: 'Tiggy the tiger on keyboard and Gajara the elephant on drums, playing together beside a jungle waterfall',
    },
    pages: [
      {
        image: ch1Page1,
        alt: 'Chapter 1, page 1 — Tiggy and Gajara play music together in the forest while logging and floodwater close in on the far side of the valley',
      },
      {
        image: ch1Page2,
        alt: 'Chapter 1, page 2 — the story continues for Tiggy and Gajara',
      },
      {
        image: ch1Page3,
        alt: 'Chapter 1, page 3 — the story continues for Tiggy and Gajara',
      },
    ],
  },
  {
    slug: 'smoke-over-the-high-canopy',
    number: 2,
    title: 'Smoke Over the High Canopy',
    characters: 'Owen',
    cover: {
      image: ch2Cover,
      alt: 'Owen the gibbon sits alone on a branch overlooking a forest fire in the distance',
    },
    pages: [
      {
        image: ch2Page1,
        alt: 'Chapter 2, page 1 — Owen plays hand percussion in the high canopy before spotting smoke rising from a volcanic peak',
      },
      {
        image: ch2Page2,
        alt: 'Chapter 2, page 2 — the story continues for Owen',
      },
      {
        image: ch2Page3,
        alt: 'Chapter 2, page 3 — the story continues for Owen',
      },
    ],
  },
  {
    slug: 'when-the-ground-roared',
    number: 3,
    title: 'When the Ground Roared',
    characters: 'Komesi',
    cover: {
      image: ch3Cover,
      alt: 'Komesi the Komodo dragon leads a group of smaller Komodo dragons away from a collapsing coastal village',
    },
    pages: [
      {
        image: ch3Page1,
        alt: 'Chapter 3, page 1 — Komesi plays guitar for a group of young Komodo dragons before the ground begins to shake',
      },
      {
        image: ch3Page2,
        alt: 'Chapter 3, page 2 — the story continues for Komesi',
      },
      {
        image: ch3Page3,
        alt: 'Chapter 3, page 3 — the story continues for Komesi',
      },
    ],
  },
  {
    slug: 'when-the-sky-fell-too-hard',
    number: 4,
    title: 'When the Sky Fell Too Hard',
    characters: 'Kanghoon & Cendry',
    cover: {
      image: ch4Cover,
      alt: 'Kanghoon the tree kangaroo on bass and Cendry the bird-of-paradise on vocals perform on a jungle stage for a crowd',
    },
    pages: [
      {
        image: ch4Page1,
        alt: 'Chapter 4, page 1 — Kanghoon and Cendry perform for the crowd before a storm floods the valley below',
      },
      {
        image: ch4Page2,
        alt: 'Chapter 4, page 2 — the story continues for Kanghoon and Cendry',
      },
      {
        image: ch4Page3,
        alt: 'Chapter 4, page 3 — the story continues for Kanghoon and Cendry',
      },
    ],
  },
  {
    slug: 'the-convergence',
    number: 5,
    title: 'The Convergence',
    characters: 'The whole band',
    locked: !CHAPTER_5_ACTIVE,
    cover: {
      image: ch5Cover,
      alt: 'All six Satwas Band members reunite and play together on a jungle stage at sunrise',
    },
    pages: [
      {
        image: ch5Page1,
        alt: 'Chapter 5, page 1 — Tiggy, Gajara, Owen, Komesi, Cendry, and Kanghoon converge from across the islands to play together',
      },
      {
        image: ch5Page2,
        alt: 'Chapter 5, page 2 — the story continues as the whole band unites',
      },
      {
        image: ch5Page3,
        alt: 'Chapter 5, page 3 — the story continues as the whole band unites',
      },
    ],
  },
]
