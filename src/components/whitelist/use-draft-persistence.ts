'use client'

import { useEffect } from 'react'

const DRAFT_STORAGE_KEY = 'encoteki-whitelist-draft'

// Restores an in-progress draft after mount (post-mount, not a lazy
// useState initializer, to avoid a server/client hydration mismatch) and
// persists it back on every change, so an accidental reload — or the
// X-OAuth redirect round-trip — doesn't silently discard the referral code,
// which Follow/Like & Repost/Comment links were opened, or the wallet
// address typed so far.
export function useDraftPersistence({
  lockedReferralCode,
  refcodeInput,
  setRefcodeInput,
  refcodeVerified,
  setRefcodeVerified,
  refcodeSkipped,
  setRefcodeSkipped,
  followClickedAt,
  setFollowClickedAt,
  likeRepostClickedAt,
  setLikeRepostClickedAt,
  commentClickedAt,
  setCommentClickedAt,
  walletAddress,
  setWalletAddress,
}: {
  lockedReferralCode: string | undefined
  refcodeInput: string
  setRefcodeInput: (value: string) => void
  refcodeVerified: boolean
  setRefcodeVerified: (value: boolean) => void
  refcodeSkipped: boolean
  setRefcodeSkipped: (value: boolean) => void
  followClickedAt: number | null
  setFollowClickedAt: (value: number) => void
  likeRepostClickedAt: number | null
  setLikeRepostClickedAt: (value: number) => void
  commentClickedAt: number | null
  setCommentClickedAt: (value: number) => void
  walletAddress: string
  setWalletAddress: (value: string) => void
}) {
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(DRAFT_STORAGE_KEY)
      if (!saved) return
      const draft = JSON.parse(saved) as {
        refcodeInput?: string
        refcodeVerified?: boolean
        refcodeSkipped?: boolean
        followClickedAt?: number | null
        likeRepostClickedAt?: number | null
        commentClickedAt?: number | null
        walletAddress?: string
      }
      // A locked code comes from the URL the applicant just followed, so it
      // outranks whatever an older draft happens to hold.
      if (typeof draft.refcodeInput === 'string' && !lockedReferralCode) {
        setRefcodeInput(draft.refcodeInput)
      }
      if (draft.refcodeVerified) setRefcodeVerified(true)
      if (draft.refcodeSkipped) setRefcodeSkipped(true)
      if (typeof draft.followClickedAt === 'number') {
        setFollowClickedAt(draft.followClickedAt)
      }
      if (typeof draft.likeRepostClickedAt === 'number') {
        setLikeRepostClickedAt(draft.likeRepostClickedAt)
      }
      if (typeof draft.commentClickedAt === 'number') {
        setCommentClickedAt(draft.commentClickedAt)
      }
      if (typeof draft.walletAddress === 'string') {
        setWalletAddress(draft.walletAddress)
      }
    } catch {
      // Corrupt or inaccessible storage (e.g. private browsing) — start fresh.
    }
    // Restore only ever needs to run once, against whatever draft existed at
    // mount time — every setter here is stable across renders, so they're
    // intentionally left out of this effect's deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockedReferralCode])

  useEffect(() => {
    try {
      sessionStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify({
          refcodeInput,
          refcodeVerified,
          refcodeSkipped,
          // Persisting the click TIMESTAMP (not a boolean) so a reload can
          // recompute elapsed dwell time against the real click moment
          // rather than granting the task instantly or restarting it.
          followClickedAt,
          likeRepostClickedAt,
          commentClickedAt,
          walletAddress,
        }),
      )
    } catch {
      // Storage unavailable/full — the draft just won't survive a reload.
    }
  }, [
    refcodeInput,
    refcodeVerified,
    refcodeSkipped,
    followClickedAt,
    likeRepostClickedAt,
    commentClickedAt,
    walletAddress,
  ])

  function clearDraft() {
    try {
      sessionStorage.removeItem(DRAFT_STORAGE_KEY)
    } catch {
      // Non-fatal — worst case a stale draft repopulates the form.
    }
  }

  return { clearDraft }
}
