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

function storyPages(color: string, captions: string[]): StoryPage[] {
  return captions.map((caption) => ({ placeholderColor: color, caption }))
}

export const STORY_CHARACTERS: StoryCharacter[] = [
  {
    slug: 'tiggy',
    name: 'Tiggy',
    badgeInitials: 'TGY',
    badgeColor: '#ffd94a',
    role: 'The Quiet Visionary',
    bannerPlaceholderColor: '#ffd94a',
    pages: storyPages('#ffd94a', [
      "Long before the Satwas Band had a name, Tiggy was the one who noticed the forest go quiet first — a change in the air the others wouldn't feel for another hour. Growing up a Sumatran tiger means learning to trust a feeling before you can explain it.",
      'The keyboard found Tiggy, not the other way around — an old upright half-swallowed by vines, keys gone soft with moss. Three days of picking out a melody nobody taught her, and the rest of the band knew: whatever she plays next, they should probably listen.',
      "Tiggy doesn't raise her voice to be heard. When the band argues about which way to go, she plays one quiet chord and waits. It's usually the right way.",
      "She's still the quietest voice in the room and still the first one anyone checks with before a big decision. Some visions don't need volume — they just need someone patient enough to hold them until the rest of the world catches up.",
    ]),
  },
  {
    slug: 'gajara',
    name: 'Gajara',
    badgeInitials: 'GJR',
    badgeColor: '#60a5fa',
    role: 'The Grounded Soul',
    bannerPlaceholderColor: '#60a5fa',
    pages: storyPages('#60a5fa', [
      'Gajara has never been in a hurry. While the rest of the herd moved on from the dry season, she stayed, testing the ground with every step until she found the water everyone else had given up on.',
      'The drums came from that same patience — Gajara can hold one steady beat for an hour without it ever feeling tired, the kind of rhythm a whole band can build a song on top of.',
      "When the ground gave way beneath the Satwas Band — literally, once, during a landslide scare in rehearsal — Gajara was the one who didn't panic. Just kept everyone moving, one slow step at a time, until they were safe.",
      "She's the heartbeat the rest of the band tunes to. Ask anyone in the Satwas Band who they'd want beside them on the worst day, and the answer is always the same.",
    ]),
  },
  {
    slug: 'owen',
    name: 'Owen',
    badgeInitials: 'OWN',
    badgeColor: '#e9d5ff',
    role: 'The Dreamer',
    bannerPlaceholderColor: '#e9d5ff',
    pages: storyPages('#e9d5ff', [
      "Owen can vanish into a melody for hours and come back with no memory of where the time went. As a gibbon, he grew up swinging between trees on nothing but instinct and trust — it turns out that's not so different from following a feeling across an island.",
      "He found the ketipung on a walk he wasn't supposed to take, three villages over from where he was meant to be, because something in the rhythm called to him and he went. He still can't explain why. He's stopped trying.",
      "Owen's bandmates used to worry when he'd go quiet mid-rehearsal, somewhere else entirely. Now they just wait — whatever he brings back from wherever he goes is usually worth it.",
      "He's imaginative, a little unreachable, and exactly the reason the Satwas Band's sound doesn't sound like anyone else's. Some daydreams are just songs that haven't found their rhythm yet.",
    ]),
  },
  {
    slug: 'komesi',
    name: 'Komesi',
    badgeInitials: 'KMS',
    badgeColor: '#86efac',
    role: 'The Steady Encourager',
    bannerPlaceholderColor: '#86efac',
    pages: storyPages('#86efac', [
      "When the ground actually roared — a tremor that sent the whole island scattering — Komesi's first move wasn't to run. It was to check that everyone else already had.",
      "She picked up the guitar to give her hands something to do while she worried about everyone else, and never put it down. Now it's how she says the things she's too humble to say out loud.",
      "Komesi is hardest on herself of anyone in the Satwas Band, even while she's the one holding the rest of them together. Ask her how she's doing and she'll ask you first.",
      "She's warm, she's wise, and she will absolutely deflect a compliment back at you within one sentence. The band wouldn't survive a bad week without her — they just haven't found a way to tell her that sticks.",
    ]),
  },
  {
    slug: 'cendry',
    name: 'Cendry',
    badgeInitials: 'CDY',
    badgeColor: '#ff9ca6',
    role: 'The Fearless Leader',
    bannerPlaceholderColor: '#ff9ca6',
    pages: storyPages('#ff9ca6', [
      "Cendry doesn't cry when the sky falls. She gets furious, then she gets a plan — and by the time anyone else has caught up to what happened, she's already three steps into fixing it.",
      'She took the mic because someone had to, and because Cendry has never once waited to be picked for anything. Lead vocals just means the loudest voice in the room finally had a reason to be.',
      "The rest of the Satwas Band follows her lead without question, and it isn't because she demands it — it's because she's usually right, and quick enough about it that arguing wastes time nobody has.",
      "Under the strategy and the main-character energy is someone who turns fear into motion faster than anyone else in the flock. That's not fearlessness. That's just deciding fear doesn't get to slow you down.",
    ]),
  },
  {
    slug: 'kanghoon',
    name: 'Kanghoon',
    badgeInitials: 'KGH',
    badgeColor: '#ff9e00',
    role: 'The Spark',
    bannerPlaceholderColor: '#ff9e00',
    pages: storyPages('#ff9e00', [
      "Kanghoon was whooping in agreement before anyone had even finished the sentence — that's just how he's built. Big energy first, details later, and somehow it always works out.",
      "He picked up the bass because it was the only instrument loud enough to keep up with him. Turns out he's got real range in there, underneath all that momentum.",
      "When the Satwas Band's energy dips — three hours into a rehearsal, everyone flagging — Kanghoon is the one who rallies them back. Spontaneous, a little chaotic, impossible to dim.",
      "He's the reason the chorus never loses momentum, on stage or off it. Some sparks burn out. Kanghoon just seems to find more oxygen.",
    ]),
  },
]
