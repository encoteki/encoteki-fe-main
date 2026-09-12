'use client'

import posthog from 'posthog-js'
import { BrutalismButton } from '@/ui/buttons'
import type { CharacterMeta } from '@/lib/quiz/content'

export default function ResultShareActions({
  character,
}: {
  character: CharacterMeta
}) {
  function handleDownload() {
    posthog.capture('quiz_share_clicked', {
      channel: 'download',
      character_slug: character.slug,
    })

    // Placeholder-stage download: draws the solid color + name onto a
    // canvas and downloads that as a real PNG. Once `character` carries a
    // real card image asset, replace this whole function with:
    //   const link = document.createElement('a')
    //   link.href = character.cardImage.src
    //   link.download = `${character.slug}-satwas-card.png`
    //   link.click()
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 1000
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = character.cardPlaceholderColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#1a1a1a'
    ctx.font = 'bold 64px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(character.name, canvas.width / 2, canvas.height / 2)

    const link = document.createElement('a')
    link.download = `${character.slug}-satwas-card.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  function handleShareToX() {
    posthog.capture('quiz_share_clicked', {
      channel: 'x',
      character_slug: character.slug,
    })
    const resultUrl = `${window.location.origin}/quiz/result/${character.slug}`
    const text = encodeURIComponent(character.shareLine)
    const url = encodeURIComponent(resultUrl)
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  function handleShareToInstagram() {
    posthog.capture('quiz_share_clicked', {
      channel: 'instagram',
      character_slug: character.slug,
    })
    // Instagram has no general web API for posting to Stories — the
    // reliable baseline (and what this ships with) is: download, then the
    // visitor shares manually from the Instagram app. See PRD Feature A
    // sharing notes for the v1.1 native-deep-link stretch goal.
    window.alert(
      "Instagram doesn't support sharing directly from the web yet — download your card, then open Instagram and add it to your Story.",
    )
  }

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-4">
      <BrutalismButton
        label="Download Card"
        bgColor="bg-white"
        onClick={handleDownload}
      />
      <BrutalismButton label="Share to X" onClick={handleShareToX} />
      <BrutalismButton
        label="Share to Instagram"
        bgColor="bg-[#ff9ca6]"
        onClick={handleShareToInstagram}
      />
    </div>
  )
}
