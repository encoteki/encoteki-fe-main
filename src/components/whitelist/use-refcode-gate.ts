'use client'

import { useState } from 'react'
import type { RefcodeCheckResponse } from './types'

export function useRefcodeGate(lockedReferralCode?: string) {
  const [refcodeInput, setRefcodeInput] = useState(lockedReferralCode ?? '')
  // A locked code stops being locked once it turns out to be wrong — a bad
  // link must not strand someone on a page they cannot proceed from.
  const [lockReleased, setLockReleased] = useState(false)
  const codeLocked = !!lockedReferralCode && !lockReleased
  const [verified, setVerified] = useState(false)
  // Set when the applicant presses "I don't have a referral code." A
  // referral code is optional, so this — like `verified` — is a second way
  // past the gate; either one hides it.
  const [skipped, setSkipped] = useState(false)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function updateInput(value: string) {
    if (codeLocked) return
    setRefcodeInput(value)
    if (error) setError(null)
  }

  async function check() {
    const code = refcodeInput.trim().toUpperCase()
    if (!code) return
    setChecking(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/whitelist/refcode/check?code=${encodeURIComponent(code)}`,
      )
      if (!res.ok) {
        setError(
          res.status === 401
            ? 'Your X sign-in expired. Sign in again and retry.'
            : "Couldn't check that code. Try again in a moment.",
        )
        return
      }
      const data = (await res.json()) as RefcodeCheckResponse
      if (data.valid) {
        setVerified(true)
      } else {
        setError('Invalid code. Check it and try again.')
        setLockReleased(true)
      }
    } catch {
      setError("Couldn't check that code — the network dropped. Try again.")
    } finally {
      setChecking(false)
    }
  }

  function skip() {
    setSkipped(true)
  }

  // Sends the applicant back to the gate card without discarding their
  // Follow/Repost/Like/Wallet progress — used when the final submit finds
  // the referral code invalid.
  function reject() {
    setVerified(false)
    setError('Invalid code. Check it and try again.')
    // If they arrived on a share link, the code in it is the one the server
    // just refused — unlock the field so they can replace it.
    setLockReleased(true)
  }

  return {
    refcodeInput,
    codeLocked,
    verified,
    skipped,
    checking,
    error,
    updateInput,
    check,
    skip,
    reject,
    // Exposed for draft restore only — see the note in use-task-dwell.ts.
    setRefcodeInput,
    setVerified,
    setSkipped,
  }
}
