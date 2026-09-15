'use client'

import { useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { isValidEvmAddress } from '@/lib/whitelist/wallet'
import {
  readQuizCharacterForWhitelist,
  clearQuizCharacterForWhitelist,
} from '@/lib/quiz/character-handoff'
import Loading from '@/app/loading'
import { InviteCodeGate } from './InviteCodeGate'
import { TaskListStep } from './TaskListStep'
import { WhitelistedView } from './WhitelistedView'
import { PRIMARY_BUTTON } from './constants'
import { useRefcodeGate } from './use-refcode-gate'
import { useTaskDwell } from './use-task-dwell'
import { useDraftPersistence } from './use-draft-persistence'
import { useFocusOnMount } from './use-focus-on-mount'
import type { StatusResponse, ValidateResponse } from './types'

export function WhitelistFlow({
  lockedReferralCode,
}: {
  // Set when the flow is reached through a share link
  // (/whitelist/refcode/ABC123). The code arrives filled and read-only so
  // the invited applicant is attributed without typing; undefined on the
  // plain /whitelist route.
  lockedReferralCode?: string
}) {
  // useSession()'s own `status` — "loading" | "authenticated" |
  // "unauthenticated" — aliased so it doesn't collide with the `status`
  // state below, which holds the /api/whitelist/status response.
  const { data: session, status: sessionStatus } = useSession()

  const [status, setStatus] = useState<StatusResponse | null>(null)
  const [statusError, setStatusError] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState('')
  const [result, setResult] = useState<ValidateResponse | null>(null)
  // A submit that failed for a reason unrelated to the task/wallet/referral
  // checks (expired session, server error, network drop). Kept separate
  // from `result` so the UI never reports a task as failed when it was
  // never actually checked.
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [characterSlug, setCharacterSlug] = useState<string | null>(null)

  useEffect(() => {
    setCharacterSlug(readQuizCharacterForWhitelist())
  }, [])

  const gate = useRefcodeGate(lockedReferralCode)
  const dwell = useTaskDwell()
  const draft = useDraftPersistence({
    lockedReferralCode,
    refcodeInput: gate.refcodeInput,
    setRefcodeInput: gate.setRefcodeInput,
    refcodeVerified: gate.verified,
    setRefcodeVerified: gate.setVerified,
    refcodeSkipped: gate.skipped,
    setRefcodeSkipped: gate.setSkipped,
    followClickedAt: dwell.followClickedAt,
    setFollowClickedAt: dwell.setFollowClickedAt,
    repostClickedAt: dwell.repostClickedAt,
    setRepostClickedAt: dwell.setRepostClickedAt,
    likeClickedAt: dwell.likeClickedAt,
    setLikeClickedAt: dwell.setLikeClickedAt,
    walletAddress,
    setWalletAddress,
  })
  // One callback ref, threaded into whichever of the sign-in button /
  // InviteCodeGate / TaskListStep is currently rendered below — each is a
  // different element/component type occupying the same JSX position, so
  // React invokes this callback fresh whenever one replaces another,
  // moving focus onto it the same way a route change would.
  // WhitelistedView is a separate top-level return (not one of these three
  // swapped children), so it owns its own copy of this hook instead.
  const focusStepRef = useFocusOnMount<HTMLElement>()

  useEffect(() => {
    fetch('/api/whitelist/status')
      .then((res) => {
        if (!res.ok) throw new Error(`status request failed (${res.status})`)
        return res.json()
      })
      .then((data: StatusResponse) => {
        setStatus(data)
        setStatusError(null)
      })
      .catch(() => {
        setStatusError(
          "Couldn't load campaign status. Check your connection and reload.",
        )
      })
  }, [session])

  async function handleSubmit() {
    if (!session?.xUsername || !session.xUserId || !status) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/whitelist/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // No self-attest checkboxes in this UI — clicking Validate &
          // Submit after opening the Follow/Repost/Like links is itself
          // the attestation. The API still requires these three booleans
          // and has no independent way to check them.
          followAttested: true,
          retweetAttested: true,
          likeAttested: true,
          walletAddress,
          referralCode: gate.skipped
            ? null
            : gate.refcodeInput.trim().toUpperCase(),
          characterSlug,
        }),
      })

      if (!res.ok) {
        setResult(null)
        setSubmitError(
          res.status === 401
            ? "Your X sign-in expired before we could submit. Sign in again and retry — your progress isn't lost."
            : `Submission failed (server responded ${res.status}). This isn't a problem with your tasks — please try again in a moment.`,
        )
        return
      }

      const data = (await res.json()) as ValidateResponse
      setResult(data)
      if (data.ok) {
        // Claim succeeded — the draft no longer represents work in
        // progress, so don't resurrect it on a future visit.
        draft.clearDraft()
        // The character has done its job (attached to this entry
        // server-side) — clear it so it can't leak onto a different,
        // quiz-less account signing in later in this same tab. The local
        // `characterSlug` state stays set so the confirmation view
        // rendered right below still shows it for this submission.
        clearQuizCharacterForWhitelist()
      }
    } catch {
      setResult(null)
      setSubmitError(
        "Couldn't complete the submission — the network dropped. Nothing was recorded; please try again.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  function handleChangeCode() {
    gate.reject()
    setResult(null)
  }

  function handleWalletChange(value: string) {
    setWalletAddress(value)
    // A previous submit's result no longer describes the address the user
    // is now typing — drop it rather than show a stale pass/fail against a
    // new value.
    if (result) setResult(null)
  }

  // Session hydration and the /api/whitelist/status fetch resolve
  // independently and at different times. Without a single gate, an
  // already-signed-in, already-whitelisted visitor reopening the page sees
  // three screens in quick succession: the sign-in button (session still
  // hydrating, so `session` reads as null exactly like "signed out"), then
  // the task list (session resolved, but status hasn't arrived yet so
  // existingEntry looks absent), then finally the whitelisted view. This
  // holds a neutral loading screen until both have settled, for anyone who
  // turns out to be signed in. A visitor who is genuinely signed out skips
  // this entirely and sees the sign-in button immediately — that screen
  // already tolerates `status` being null (see the `?? "a few"` and
  // `?? "Whitelist"` fallbacks below), so there is nothing to wait for on
  // that path.
  const statusSettled = status !== null || statusError !== null
  if (
    sessionStatus === 'loading' ||
    (sessionStatus === 'authenticated' && !statusSettled)
  ) {
    return <Loading />
  }

  if (status?.existingEntry) {
    return (
      <WhitelistedView
        username={status.existingEntry.xUsername}
        referralCode={status.existingEntry.referralCode}
        referralUsesCount={status.existingEntry.referralUsesCount}
        tier={status.existingEntry.tier}
        guaranteedThreshold={status.guaranteedThreshold}
        characterSlug={status.existingEntry.characterSlug}
      />
    )
  }

  // A submit that just succeeded means the same thing as existingEntry
  // above — go straight to the same confirmation view rather than an
  // inline popup, so a first-time success and a returning visit look
  // identical (session.xUsername/result.spotNumber/result.referralCode are
  // guaranteed here: handleSubmit only runs with a signed-in session, and
  // the API always pairs ok:true with a real spotNumber and referralCode).
  // Falls through to the main form below only in the unreachable edge case
  // where that's not true. A freshly minted code always starts at zero
  // referrals and the fcfs tier, so both are safe to pass literally
  // without a second round trip.
  if (
    result?.ok &&
    result.spotNumber !== null &&
    result.referralCode &&
    session?.xUsername &&
    status
  ) {
    return (
      <WhitelistedView
        username={session.xUsername}
        referralCode={result.referralCode}
        referralUsesCount={0}
        tier={result.tier ?? 'fcfs'}
        guaranteedThreshold={status.guaranteedThreshold}
        characterSlug={characterSlug}
      />
    )
  }

  // Client-side format check so a malformed address is caught before a
  // round trip to the server, not only after. The server remains the
  // authoritative checksum check.
  const walletFormatInvalid =
    walletAddress.length > 0 && !isValidEvmAddress(walletAddress)

  const canSubmit =
    dwell.allDone && isValidEvmAddress(walletAddress) && !!status && !submitting

  const resultIsPositive =
    !!result &&
    (result.ok ||
      (result.reason === 'duplicate_x_account' && result.spotNumber !== null))

  return (
    <main className="flex min-h-screen w-full animate-fade-in items-center justify-center bg-(--khaki-90) px-4 pt-20 pb-10 tablet:px-12 tablet:pt-28 tablet:pb-24 sm:px-6 sm:pt-24 sm:pb-16">
      <div className="w-full max-w-md">
        <div className="flex w-full flex-col gap-5 rounded-4xl bg-white p-6 shadow-lg tablet:p-8">
          <div>
            <h1 className="text-h2 font-semibold tracking-tight text-(--neutral-10)">
              {status?.campaignName ?? 'Whitelist'}
            </h1>
            <p className="mt-1 text-small text-(--neutral-30)">
              {session ? (
                <>
                  Follow, repost, like, and submit your wallet address to claim
                  your spot. Get {status?.guaranteedThreshold ?? 'a few'} people
                  to do the same with your code and your mint is guaranteed.
                </>
              ) : (
                'Complete a few tasks to join the Encoteki NFT whitelist.'
              )}
            </p>
          </div>

          {statusError && (
            <p className="text-small text-(--primary-red)" aria-live="polite">
              {statusError}
            </p>
          )}

          {!session ? (
            <button
              ref={focusStepRef}
              tabIndex={-1}
              onClick={() => signIn('twitter')}
              className={`animate-fade-up outline-none ${PRIMARY_BUTTON}`}
            >
              Sign in with X
            </button>
          ) : !gate.verified && !gate.skipped ? (
            <InviteCodeGate
              ref={focusStepRef}
              username={session.xUsername}
              refcodeInput={gate.refcodeInput}
              codeLocked={gate.codeLocked}
              onChangeInput={gate.updateInput}
              refcodeError={gate.error}
              onCheck={gate.check}
              refcodeChecking={gate.checking}
              onSkip={gate.skip}
            />
          ) : (
            <TaskListStep
              ref={focusStepRef}
              username={session.xUsername}
              status={status}
              dwell={dwell}
              walletAddress={walletAddress}
              onChangeWallet={handleWalletChange}
              walletFormatInvalid={walletFormatInvalid}
              walletRejectedByServer={result?.marks.wallet === 'no'}
              canSubmit={canSubmit}
              onSubmit={handleSubmit}
              submitting={submitting}
              submitError={submitError}
              result={result}
              resultIsPositive={resultIsPositive}
              onChangeCode={handleChangeCode}
            />
          )}
        </div>
      </div>
    </main>
  )
}
