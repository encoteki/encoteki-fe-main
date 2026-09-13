import type { StaticImageData } from 'next/image'

import tiggyCard from '@/assets/quiz-cards/tiggy.webp'
import gajaraCard from '@/assets/quiz-cards/gajara.webp'
import owenCard from '@/assets/quiz-cards/owen.webp'
import komesiCard from '@/assets/quiz-cards/komesi.webp'
import cendryCard from '@/assets/quiz-cards/cendry.webp'
import kanghoonCard from '@/assets/quiz-cards/kanghoon.webp'

export type Letter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export const LETTERS: readonly Letter[] = ['A', 'B', 'C', 'D', 'E', 'F']

export interface CharacterMeta {
  letter: Letter
  slug: string
  name: string
  emoji: string
  animal: string
  mbti: string
  instrument: string
  title: string
  description: string[]
  shareLine: string
  // The finished result card art (tarot-card style, name/animal/MBTI/
  // instrument/title/quote already baked into the image).
  cardImage: StaticImageData
  // Background tint for the landscape OG image, where the portrait card
  // doesn't fill the frame on its own.
  cardPlaceholderColor: string
}

// slug values here MUST match src/lib/story/content.ts's STORY_CHARACTERS
// slugs — see Global Constraints.
export const CHARACTERS: Record<Letter, CharacterMeta> = {
  A: {
    letter: 'A',
    slug: 'tiggy',
    name: 'Tiggy',
    emoji: '🐯',
    animal: 'Sumatran Tiger',
    mbti: 'INFJ',
    instrument: 'Keyboard',
    title: 'The Quiet Visionary',
    description: [
      'Felt the wrongness in the rhythm before anyone else did',
      "Deep and imaginative, with a poet's instinct",
      'Quietly principled — leads with inner vision, not volume',
    ],
    shareLine: "I'm Tiggy — I feel things before anyone else says a word 🎹",
    cardImage: tiggyCard,
    cardPlaceholderColor: '#ffd94a',
  },
  B: {
    letter: 'B',
    slug: 'gajara',
    name: 'Gajara',
    emoji: '🐘',
    animal: 'Sumatran Elephant',
    mbti: 'ISFP',
    instrument: 'Drums',
    title: 'The Grounded Soul',
    description: [
      'Stayed steady while the ground gave way around you',
      'Warm, flexible, content to exist fully in the moment',
      'The one the whole band leans on for calm',
    ],
    shareLine: "I'm Gajara — steady heartbeat, unshakeable 🥁",
    cardImage: gajaraCard,
    cardPlaceholderColor: '#60a5fa',
  },
  C: {
    letter: 'C',
    slug: 'owen',
    name: 'Owen',
    emoji: '🐒',
    animal: 'Silvery Gibbon',
    mbti: 'INFP',
    instrument: 'Ketipung / hand percussion',
    title: 'The Dreamer',
    description: [
      'Can disappear into a melody for hours',
      'Idealistic and sensitive, imagination-first',
      'Followed a feeling across an island because you trusted it more than logic',
    ],
    shareLine: "I'm Owen — head in the clouds, heart in the music 🌫️",
    cardImage: owenCard,
    cardPlaceholderColor: '#e9d5ff',
  },
  D: {
    letter: 'D',
    slug: 'komesi',
    name: 'Komesi',
    emoji: '🦎',
    animal: 'Komodo Dragon',
    mbti: 'ENFJ',
    instrument: 'Guitar',
    title: 'The Steady Encourager',
    description: [
      'Checked on everyone else first when the ground literally roared',
      'Warm and wise, always lifting others up',
      "Hardest on yourself, even when you're holding everyone together",
    ],
    shareLine: "I'm Komesi — I hold the group together, always have 🎸",
    cardImage: komesiCard,
    cardPlaceholderColor: '#86efac',
  },
  E: {
    letter: 'E',
    slug: 'cendry',
    name: 'Cendry',
    emoji: '🦜',
    animal: 'Bird-of-Paradise',
    mbti: 'ENTJ',
    instrument: 'Mic (lead vocals)',
    title: 'The Fearless Leader',
    description: [
      "Doesn't cry when the sky falls — gets furious, then gets a plan",
      'Strategic and quick-witted, main-character energy',
      'The band follows your lead without question',
    ],
    shareLine: "I'm Cendry — turn the fear into a plan, every time 🎤",
    cardImage: cendryCard,
    cardPlaceholderColor: '#ff9ca6',
  },
  F: {
    letter: 'F',
    slug: 'kanghoon',
    name: 'Kanghoon',
    emoji: '🦘',
    animal: 'Tree Kangaroo',
    mbti: 'ENFP',
    instrument: 'Bass',
    title: 'The Spark',
    description: [
      'Boundless energy, big ideas, whooping in agreement before anyone finishes a sentence',
      'Spontaneous, passionate, impossible to dim',
      'The reason the chorus never loses momentum',
    ],
    shareLine: "I'm Kanghoon — big heart, bigger energy 🎸",
    cardImage: kanghoonCard,
    cardPlaceholderColor: '#ff9e00',
  },
}

export interface QuizQuestion {
  id: number
  prompt: string
  options: Record<Letter, string>
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    prompt: "Disaster hits. What's your instinct?",
    options: {
      A: "You feel the shift before anyone else even notices something's wrong",
      B: 'Stay calm, feet on the ground, just keep going',
      C: 'Retreat inward for a moment to feel it fully before you move',
      D: "Check on everyone else's safety before your own",
      E: 'Get furious — then get a plan',
      F: 'Rally everyone, keep the momentum up',
    },
  },
  {
    id: 2,
    prompt: 'Pick your ideal day off.',
    options: {
      A: 'Alone with your thoughts, total quiet',
      B: 'Slow morning, good food, zero rush',
      C: 'Lost in a playlist or a daydream for hours',
      D: 'Checking in on friends who need a pep talk',
      E: 'Planning next month down to the hour',
      F: 'Spontaneous trip, no itinerary',
    },
  },
  {
    id: 3,
    prompt: "In a group project, you're the one who...",
    options: {
      A: 'Sees the deeper "why" behind what everyone\'s doing',
      B: 'Keeps everyone calm when it gets chaotic',
      C: 'Comes up with the most original (if unconventional) idea',
      D: 'Makes sure the quiet ones get heard',
      E: 'Takes charge and assigns who does what',
      F: 'Gets everyone hyped when energy dips',
    },
  },
  {
    id: 4,
    prompt: 'Your bandmates would describe you as...',
    options: {
      A: 'Thoughtful, a little mysterious, quietly principled',
      B: 'Easygoing, warm, impossible to rattle',
      C: 'Sensitive, imaginative, off in your own world (in a good way)',
      D: 'Encouraging, warm — sometimes too hard on yourself',
      E: 'Bossy but usually right, quick-witted',
      F: 'The loudest heart in the room',
    },
  },
  {
    id: 5,
    prompt: 'Something you love is under threat. You...',
    options: {
      A: 'Feel it before you can even explain why',
      B: 'Stay rooted, refuse to panic, adapt as you go',
      C: 'Need a moment alone before you can act',
      D: "Make sure everyone's okay first, then let yourself feel it",
      E: 'Turn the fear into fury, then into a plan',
      F: "Grab everyone's hand and keep moving forward together",
    },
  },
  {
    id: 6,
    prompt: 'Gut reaction — pick an instrument.',
    options: {
      A: 'Keyboard',
      B: 'Drums',
      C: 'Ketipung / hand percussion',
      D: 'Guitar',
      E: 'Mic (lead vocals)',
      F: 'Bass',
    },
  },
]

export const TIEBREAK_PROMPT =
  "You're torn between a few voices in the chorus. Last thing — when the music stops, what do you want people to remember about you?"

export const TIEBREAK_OPTIONS: Record<Letter, string> = {
  A: 'That I noticed what others missed',
  B: 'That I stayed steady when things fell apart',
  C: 'That I felt everything, fully',
  D: 'That I made sure no one was left behind',
  E: 'That I turned the fear into a plan',
  F: 'That I never let the energy die',
}
