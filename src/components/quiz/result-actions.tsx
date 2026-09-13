'use client'

import posthog from 'posthog-js'
import { Download } from 'lucide-react'
import type { CharacterMeta } from '@/lib/quiz/content'

// The whitelist flow itself still lives in the external app until Feature C
// (Whitelist Migration) lands in this repo — same target the header nav's
// "Whitelist" entry already points to.
const WHITELIST_URL = process.env.NEXT_PUBLIC_APP_MINT || '#'

export default function ResultActions({
  character,
}: {
  character: CharacterMeta
}) {
  function handleDownload() {
    posthog.capture('quiz_share_clicked', {
      channel: 'download',
      character_slug: character.slug,
    })

    const link = document.createElement('a')
    link.href = character.cardImage.src
    link.download = `${character.slug}-satwas-card.webp`
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  function handleWhitelistClick() {
    posthog.capture('quiz_whitelist_cta_clicked', {
      character_slug: character.slug,
    })
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={handleDownload}
        aria-label="Download your Satwas card"
        className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 border-(--primary-black) bg-white text-(--primary-black) shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary-black)"
      >
        <Download className="h-6 w-6" strokeWidth={2} />
      </button>
      <a
        href={WHITELIST_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleWhitelistClick}
        className="cursor-pointer rounded-full border-2 border-(--primary-black) bg-[#ccf281] px-6 py-3.5 text-center text-sm font-black tracking-wider text-(--primary-black) uppercase shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary-black)"
      >
        Join the Whitelist
      </a>
    </div>
  )
}
