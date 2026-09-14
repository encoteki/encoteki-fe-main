'use client'

import posthog from 'posthog-js'
import { Download } from 'lucide-react'
import type { CharacterMeta } from '@/lib/quiz/content'
import { saveQuizCharacterForWhitelist } from '@/lib/quiz/character-handoff'

export default function ResultActions({
  character,
  linkedToWhitelist = false,
}: {
  character: CharacterMeta
  // True when this result is already being saved straight to an existing
  // whitelist entry (see quiz/page.tsx's `linkToWhitelist`) — "Join the
  // Whitelist" would be misleading for a visitor who's whitelisted already,
  // so the second action becomes a plain way back instead of a signup CTA.
  linkedToWhitelist?: boolean
}) {
  function handleDownload() {
    posthog.capture('quiz_share_clicked', {
      channel: 'download',
      character_slug: character.slug,
    })

    const link = document.createElement('a')
    link.href = `/api/quiz/card-image/${character.slug}`
    link.download = `${character.slug}-satwas-card.jpg`
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  function handleWhitelistClick() {
    saveQuizCharacterForWhitelist(character.slug)
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
        href="/whitelist"
        onClick={linkedToWhitelist ? undefined : handleWhitelistClick}
        className="cursor-pointer rounded-full border-2 border-(--primary-black) bg-[#ccf281] px-6 py-3.5 text-center text-sm font-black tracking-wider text-(--primary-black) uppercase shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary-black)"
      >
        {linkedToWhitelist ? 'Back to Whitelist' : 'Join the Whitelist'}
      </a>
    </div>
  )
}
