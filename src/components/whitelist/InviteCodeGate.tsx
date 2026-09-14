'use client'

import { SignedInBar } from './SignedInBar'
import { PRIMARY_BUTTON } from './constants'

// Root takes `ref` + tabIndex={-1} from the caller — the orchestrator owns
// one focus-on-mount callback for every step in the main form (this, the
// sign-in button, TaskListStep) and threads it into whichever one is
// currently rendered, rather than each step importing and calling its own
// copy of that hook. Arriving here from the sign-in step — or back here
// from the task list via "Change code" — moves focus onto this step
// instead of leaving it on whatever button just unmounted.
export function InviteCodeGate({
  ref,
  username,
  refcodeInput,
  codeLocked,
  onChangeInput,
  refcodeError,
  onCheck,
  refcodeChecking,
  onSkip,
}: {
  ref?: React.Ref<HTMLDivElement>
  username: string | undefined
  refcodeInput: string
  codeLocked: boolean
  onChangeInput: (value: string) => void
  refcodeError: string | null
  onCheck: () => void
  refcodeChecking: boolean
  onSkip: () => void
}) {
  return (
    <div
      ref={ref}
      tabIndex={-1}
      className="flex animate-fade-up flex-col gap-5 outline-none"
    >
      <SignedInBar username={username} />

      <div className="flex flex-col gap-2 border-t border-(--khaki-70) pt-4">
        <label
          htmlFor="refcode"
          className="text-caption font-semibold tracking-wider text-(--neutral-30) uppercase"
        >
          Invite code
        </label>
        <p className="text-small text-(--neutral-30)">
          {codeLocked
            ? 'This code came from the link you followed. Continuing credits whoever shared it.'
            : 'Have a code from someone already whitelisted? Enter it to credit them — otherwise, skip it below.'}
        </p>
        <input
          id="refcode"
          type="text"
          value={refcodeInput}
          readOnly={codeLocked}
          onChange={(e) => onChangeInput(e.target.value)}
          placeholder="ABC123"
          aria-invalid={!!refcodeError}
          aria-describedby={refcodeError ? 'refcode-error' : undefined}
          className={`rounded-xl border bg-white px-4 py-3 font-mono text-small text-(--neutral-10) shadow-sm transition-colors duration-200 placeholder:text-(--neutral-30)/60 focus:outline-none ${
            refcodeError
              ? 'border-(--primary-red) focus:ring-1 focus:ring-(--primary-red)/50'
              : 'border-(--neutral-40) focus:border-(--primary-green) focus:ring-1 focus:ring-(--primary-green)/50'
          } ${codeLocked ? 'cursor-not-allowed bg-(--khaki-90) text-(--neutral-30)' : ''}`}
        />
        {refcodeError && (
          <p
            id="refcode-error"
            className="animate-fade-in text-caption text-(--primary-red)"
            aria-live="polite"
          >
            {refcodeError}
          </p>
        )}
        <button
          onClick={onCheck}
          disabled={!refcodeInput.trim() || refcodeChecking}
          className={PRIMARY_BUTTON}
        >
          {refcodeChecking ? 'Checking…' : 'Continue'}
        </button>
        {!codeLocked && (
          <button
            type="button"
            onClick={onSkip}
            className="cursor-pointer text-caption font-semibold text-(--neutral-30) underline transition-colors hover:text-(--neutral-10)"
          >
            I don&apos;t have a referral code
          </button>
        )}
      </div>
    </div>
  )
}
