'use client'

import { signOut } from 'next-auth/react'
import { clearQuizCharacterForWhitelist } from '@/lib/quiz/character-handoff'

// The "Signed in as @x / Sign out" bar — shared by the invite-code gate and
// the task-list step. Both call sites already sit inside a
// `border-t border-(--khaki-70) pt-4` rhythm from their parent's `gap-5`,
// so this owns only its own row layout, not that spacing.
export function SignedInBar({ username }: { username: string | undefined }) {
  function handleSignOut() {
    // A quiz-result handoff still sitting in sessionStorage belongs to the
    // account signed in right now — it must not survive into whoever signs
    // in next in this same tab.
    clearQuizCharacterForWhitelist()
    signOut()
  }

  return (
    <div className="flex items-center justify-between border-t border-(--khaki-70) pt-4">
      <p className="text-small text-(--neutral-30)">
        Signed in as{' '}
        <span className="font-medium text-(--neutral-10)">@{username}</span>
      </p>
      <button
        onClick={handleSignOut}
        className="cursor-pointer text-caption font-semibold text-(--primary-red) transition-colors hover:text-(--primary-red)/80"
      >
        Sign out
      </button>
    </div>
  )
}
