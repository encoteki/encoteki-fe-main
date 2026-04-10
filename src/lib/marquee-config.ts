/**
 * Dynamically loads marquee text from environment variables
 * Pattern: NEXT_PUBLIC_MARQUEE_TEXT_1, NEXT_PUBLIC_MARQUEE_TEXT_2, etc.
 * Odd numbers = main text, Even numbers = separator text
 */

const DEFAULT_MARQUEE_TEXTS = [
  'Live on Base',
  'Live on Arbitrum',
  'Live on Lisk',
  'Live on Manta',
]

const DEFAULT_MARQUEE_SEPARATORS = ['Join Now!']

export function getMarqueeTexts() {
  const texts: string[] = []
  const separators: string[] = []

  // Access env vars directly - Next.js replaces these at build time
  const envEntries = [
    process.env.NEXT_PUBLIC_MARQUEE_TEXT_1,
    process.env.NEXT_PUBLIC_MARQUEE_TEXT_2,
    process.env.NEXT_PUBLIC_MARQUEE_TEXT_3,
    process.env.NEXT_PUBLIC_MARQUEE_TEXT_4,
    process.env.NEXT_PUBLIC_MARQUEE_TEXT_5,
    process.env.NEXT_PUBLIC_MARQUEE_TEXT_6,
    process.env.NEXT_PUBLIC_MARQUEE_TEXT_7,
    process.env.NEXT_PUBLIC_MARQUEE_TEXT_8,
    process.env.NEXT_PUBLIC_MARQUEE_TEXT_9,
    process.env.NEXT_PUBLIC_MARQUEE_TEXT_10,
    process.env.NEXT_PUBLIC_MARQUEE_TEXT_11,
    process.env.NEXT_PUBLIC_MARQUEE_TEXT_12,
    process.env.NEXT_PUBLIC_MARQUEE_TEXT_13,
    process.env.NEXT_PUBLIC_MARQUEE_TEXT_14,
    process.env.NEXT_PUBLIC_MARQUEE_TEXT_15,
    process.env.NEXT_PUBLIC_MARQUEE_TEXT_16,
    process.env.NEXT_PUBLIC_MARQUEE_TEXT_17,
    process.env.NEXT_PUBLIC_MARQUEE_TEXT_18,
    process.env.NEXT_PUBLIC_MARQUEE_TEXT_19,
    process.env.NEXT_PUBLIC_MARQUEE_TEXT_20,
  ]

  // Separate odd (text) and even (separator) entries
  envEntries.forEach((value, index) => {
    const normalizedValue = value?.trim()
    if (!normalizedValue) return

    const num = index + 1 // Convert 0-based index to 1-based numbering
    if (num % 2 === 1) {
      // Odd numbers are main texts
      texts.push(normalizedValue)
    } else {
      // Even numbers are separators
      separators.push(normalizedValue)
    }
  })

  return {
    texts: texts.length > 0 ? texts : DEFAULT_MARQUEE_TEXTS,
    separators: separators.length > 0 ? separators : DEFAULT_MARQUEE_SEPARATORS,
  }
}
