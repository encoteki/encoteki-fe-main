'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { CHARACTERS } from '@/lib/quiz/content'
import { REFERRAL_CARD_IMAGES } from '@/lib/quiz/referral-cards'
import { clearQuizCharacterForWhitelist } from '@/lib/quiz/character-handoff'
import { PRIMARY_BUTTON } from './constants'
import { CheckIcon, DownloadIcon, InstagramIcon, PawIcon } from './icons'
import { useFocusOnMount } from './use-focus-on-mount'

// Shared by both "you already have a spot" paths: a returning applicant
// (status.existingEntry) and a first-time successful submit (result.ok).
// Both mean the same thing to the visitor, so both get the same full-page
// confirmation instead of two differently-worded "success" UIs.
export function WhitelistedView({
  username,
  referralCode,
  referralUsesCount,
  tier,
  guaranteedThreshold,
  characterSlug,
}: {
  username: string
  referralCode: string
  referralUsesCount: number
  tier: 'fcfs' | 'guaranteed'
  guaranteedThreshold: number
  characterSlug: string | null
}) {
  const [copied, setCopied] = useState(false)
  const [cardFile, setCardFile] = useState<File | null>(null)
  const [preparing, setPreparing] = useState(true)
  const hasCard = Boolean(characterSlug && REFERRAL_CARD_IMAGES[characterSlug])
  // This view replaces whatever screen was showing (sign-in, gate, or task
  // list) the moment a claim succeeds — move focus to its heading so that
  // jump is announced the same way a route change would be, instead of
  // leaving focus on the now-unmounted Submit button.
  const headingRef = useFocusOnMount<HTMLHeadingElement>()

  function handleSignOut() {
    // Same account-boundary guard as SignedInBar's sign-out: a leftover
    // quiz-result handoff in sessionStorage must not leak onto whoever
    // signs in next in this tab.
    clearQuizCharacterForWhitelist()
    signOut()
  }

  // Pre-fetches the same JPEG the download button saves, as soon as the
  // card is known — not on click. iOS Safari only treats navigator.share()
  // as a direct response to the tap (and shows the share sheet) when
  // nothing async has run between the gesture and the call; a fetch
  // awaited inside the click handler burns that window, share() then
  // throws silently, and the button falls straight through to a plain
  // download with no share sheet ever appearing. Fetching ahead of time
  // means the click handler can call share() with no await in front of it.
  useEffect(() => {
    if (!hasCard) return
    let cancelled = false
    const cardHref = `/api/whitelist/card-image/${referralCode}`
    const fileName = `encoteki-whitelist-${referralCode}.jpg`
    fetch(cardHref)
      .then((res) =>
        res.ok ? res.blob() : Promise.reject(new Error('fetch failed')),
      )
      .then((blob) => {
        if (!cancelled) {
          setCardFile(
            new File([blob], fileName, { type: blob.type || 'image/jpeg' }),
          )
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setPreparing(false)
      })
    return () => {
      cancelled = true
    }
  }, [hasCard, referralCode])

  // The OS decides what apps can accept an image file, and Instagram (if
  // installed) is one of them — there's no way to open Instagram directly
  // from a website, skipping that picker; this is the closest a web page
  // gets. Falls back to a plain download whenever file sharing isn't
  // available (most desktop browsers today), the pre-fetch above hasn't
  // resolved yet, or the share attempt fails for a reason other than the
  // visitor cancelling it.
  function handleShareToInstagram() {
    const cardHref = `/api/whitelist/card-image/${referralCode}`
    const fileName = `encoteki-whitelist-${referralCode}.jpg`

    if (cardFile && navigator.canShare?.({ files: [cardFile] })) {
      navigator.share({ files: [cardFile] }).catch((err) => {
        // The visitor closed the share sheet themselves — a deliberate "no
        // thanks," not a failure, so don't follow it with a surprise
        // download.
        if (err instanceof DOMException && err.name === 'AbortError') return
        triggerDownload(cardHref, fileName)
      })
      return
    }

    triggerDownload(cardHref, fileName)
  }

  function triggerDownload(href: string, fileName: string) {
    const link = document.createElement('a')
    link.href = href
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/whitelist/refcode/${referralCode}`,
      )
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable/blocked (e.g. insecure context, denied
      // permission) — the button can't copy the link, but the bare code is
      // still visible on screen to select and copy by hand.
    }
  }

  // Wrapper matches the loading screen and the main form's max-w-md column
  // and tablet/desktop padding, minus the floating logo those screens show
  // above the card — the confirmation itself is the payoff moment here, not
  // a form to orient into, so nothing needs to sit above it.
  return (
    <main className="flex min-h-screen w-full animate-fade-in items-center justify-center bg-(--khaki-90) px-4 py-10 tablet:px-12 tablet:py-24 sm:px-6 sm:py-16">
      <div className="w-full max-w-md tablet:max-w-2xl">
        <div className="flex w-full flex-col items-center gap-3 rounded-4xl bg-white p-6 text-center shadow-lg tablet:p-8">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-h2 font-medium tracking-tight text-(--primary-green) outline-none"
          >
            You&apos;re whitelisted, @{username}
          </h1>

          {/* Below the title, the view always splits by meaning: status
              (tier + invite code — what to do next) stays left, the right
              column holds whatever the visitor's next artifact is — the
              card + download once there's a character, or, before that,
              the CTA to go find one. */}
          <div className="flex w-full flex-col gap-4 tablet:flex-row tablet:items-stretch tablet:gap-6">
            <div className="flex w-full min-w-0 flex-col items-center gap-3 tablet:flex-1 tablet:justify-between">
              {/* The status is the main point of view on this whole screen
                  — the thing the visitor most needs to register before
                  anything else — so it gets the boldest treatment on the
                  page: full green fill (Guaranteed) or a heavy green-bordered
                  wash (FCFS), a real icon, and the status word set at
                  headline scale instead of a small pill. The referral
                  progress dots are a new, purely visual reinforcement of a
                  number the invite-code panel below already states in
                  words — decorative, not the only way to read it, so they're
                  aria-hidden rather than duplicating an accessible name. */}
              {tier === 'guaranteed' ? (
                <div className="mt-2 flex w-full animate-fade-up flex-col items-center gap-3 rounded-xl bg-(--primary-green) p-6 text-center shadow-primary">
                  <div className="flex h-14 w-14 animate-check-pop items-center justify-center rounded-full bg-white/15">
                    <CheckIcon size="h-8 w-8" className="text-white" />
                  </div>
                  <p className="text-h3 font-semibold tracking-tight text-white uppercase">
                    Guaranteed
                  </p>
                  <p className="text-small text-white/80">
                    {/* This 3 is the FCFS per-wallet mint limit set by the
                    OpenSea allowlist configuration — a wallet on the FCFS
                    list may mint up to 3 NFTs. It is unrelated to
                    guaranteedThreshold (the referral count needed for
                    promotion) even though the two numbers coincide today;
                    do not merge them or derive this one from the other. */}
                    One mint is reserved for this wallet, and you keep your FCFS
                    place for up to 3 more.
                  </p>
                </div>
              ) : (
                <div className="mt-2 flex w-full animate-fade-up flex-col items-center gap-3 rounded-xl border border-(--khaki-70) bg-(--green-90) p-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-(--primary-green)">
                    <PawIcon size="h-7 w-7" className="text-white" />
                  </div>
                  <p className="text-h3 font-semibold tracking-tight text-(--primary-green) uppercase">
                    FCFS
                  </p>
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    {Array.from({ length: guaranteedThreshold }).map((_, i) => (
                      <span
                        key={i}
                        className={`h-2 w-8 rounded-full transition-colors duration-500 ${
                          i < referralUsesCount
                            ? 'bg-(--primary-green)'
                            : 'bg-(--khaki-70)'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-small text-(--neutral-30)">
                    You can mint while supply lasts. Get {guaranteedThreshold}{' '}
                    people to finish the tasks with your code and you&apos;re
                    upgraded to Guaranteed, with one mint reserved for you.
                  </p>
                </div>
              )}

              <div className="flex w-full flex-col items-center gap-2 rounded-xl border border-(--khaki-70) bg-(--green-90) p-4">
                <p className="text-caption font-semibold tracking-wider text-(--neutral-30) uppercase">
                  Your invite code
                </p>
                <div className="flex items-center gap-2">
                  <span className="rounded-xl bg-white px-4 py-2 font-mono text-small font-semibold text-(--neutral-10)">
                    {referralCode}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="cursor-pointer rounded-full bg-(--primary-green) px-4 py-2.5 text-caption font-semibold text-white transition-[background-color,transform] duration-300 outline-none hover:bg-(--green-10) focus-visible:ring-2 focus-visible:ring-(--primary-green) focus-visible:ring-offset-2 active:scale-95"
                  >
                    <span
                      key={copied ? 'copied' : 'copy'}
                      className={`inline-block ${copied ? 'animate-check-pop' : ''}`}
                    >
                      {copied ? 'Copied!' : 'Copy link'}
                    </span>
                  </button>
                </div>
                {referralUsesCount === 0 ? (
                  <p className="text-caption text-(--neutral-30)">
                    No one has used your code yet.
                  </p>
                ) : tier === 'guaranteed' ? (
                  <p className="text-caption font-semibold text-(--primary-green)">
                    {referralUsesCount}{' '}
                    {referralUsesCount === 1 ? 'person has' : 'people have'}{' '}
                    used your code and finished the tasks.
                  </p>
                ) : (
                  <p className="text-caption font-semibold text-(--primary-green)">
                    {/* /api/whitelist/status fetches the entry and its referral
                    code in two separate round trips, not one transaction,
                    so a referral landing between them can pair
                    tier:"fcfs" with a referralUsesCount that has already
                    reached (or passed) guaranteedThreshold. Clamp so that
                    momentary lead never renders a negative remainder. */}
                    {referralUsesCount} of {guaranteedThreshold} have used your
                    code and finished the tasks —{' '}
                    {Math.max(0, guaranteedThreshold - referralUsesCount)} to
                    go.
                  </p>
                )}
              </div>

              {hasCard && characterSlug && (
                <div className="flex w-full items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShareToInstagram}
                    disabled={preparing}
                    className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap ${PRIMARY_BUTTON}`}
                  >
                    <InstagramIcon size="h-4 w-4" />
                    {preparing ? 'Preparing…' : 'Share'}
                  </button>
                  <a
                    href={`/api/whitelist/card-image/${referralCode}`}
                    download={`encoteki-whitelist-${referralCode}.jpg`}
                    aria-label="Download your card"
                    title="Download your card"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-(--khaki-70) bg-white text-(--neutral-10) shadow-sm transition-colors duration-200 outline-none hover:bg-(--green-90) focus-visible:ring-2 focus-visible:ring-(--primary-green) focus-visible:ring-offset-2 active:scale-95"
                  >
                    <DownloadIcon size="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>

            {hasCard && characterSlug ? (
              // Equal-width partner to the left column (tablet:flex-1 on
              // both, min-w-0 so this one can shrink below the image's own
              // preferred size instead of forcing an overflow) — not a
              // narrow fixed-width sidebar. The art is sized off its own
              // width like any normal image (no fill/aspect-ratio-from-
              // height tricks); at an equal share of the row it's wide
              // enough to read as the visual match for the left column
              // without needing to be forced to its exact pixel height.
              <div className="flex w-full min-w-0 flex-col items-center gap-2 tablet:flex-1">
                <Image
                  src={REFERRAL_CARD_IMAGES[characterSlug]}
                  alt={`Your Satwas card, with your invite code ${referralCode}`}
                  priority
                  className="w-full rounded-xl border border-(--khaki-70) shadow-sm"
                />
              </div>
            ) : (
              // No character on this entry yet — a visitor who went
              // straight to whitelist without taking the quiz first. The
              // quiz result screen, reached from here, saves straight back
              // to this entry once finished (see /api/whitelist/character
              // and quiz/page.tsx's `linkToWhitelist`) — no signup step to
              // repeat, since this account already has a spot.
              <div className="flex w-full flex-col items-center justify-between gap-4 rounded-xl border border-(--khaki-70) bg-(--green-90) p-6 text-center tablet:w-56 tablet:shrink-0">
                {/* The six dots are each character's actual card color
                    (same values quiz/page.tsx's "Finding your Satwas"
                    loader uses) — the box's own hook is "which of these
                    are you," so showing the real palette earns its keep as
                    content, not decoration standing in for it. */}
                <div className="grid grid-cols-3 gap-2" aria-hidden="true">
                  {Object.values(CHARACTERS).map((character) => (
                    <span
                      key={character.slug}
                      className="h-5 w-5 rounded-full border border-white/60 shadow-sm"
                      style={{
                        backgroundColor: character.cardPlaceholderColor,
                      }}
                    />
                  ))}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-small font-semibold text-(--neutral-10)">
                    Which Satwas are you?
                  </p>
                  <p className="text-caption text-(--neutral-30)">
                    Take the quiz and get your own character card.
                  </p>
                </div>
                <a
                  href="/quiz"
                  className={`w-full text-center ${PRIMARY_BUTTON} hover:bg-(--green-10) hover:shadow-primary-hover active:scale-[0.98]`}
                >
                  Know your Satwas
                </a>
              </div>
            )}
          </div>

          <button
            onClick={handleSignOut}
            className="mt-2 cursor-pointer rounded text-caption font-semibold text-(--primary-red) transition-colors outline-none hover:text-(--primary-red)/80 focus-visible:ring-2 focus-visible:ring-(--primary-red) focus-visible:ring-offset-2"
          >
            Sign out
          </button>
        </div>
      </div>
    </main>
  )
}
