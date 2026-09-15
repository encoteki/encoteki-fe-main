'use client'

import { TaskRow } from './TaskRow'
import { SignedInBar } from './SignedInBar'
import { ResultPanel } from './ResultPanel'
import { PRIMARY_BUTTON } from './constants'
import type { StatusResponse, ValidateResponse } from './types'
import type { TaskDwell } from './use-task-dwell'

// The target account is known not to rename, so a plain username link is
// fine here — unlike the post link below, a tweet has no identifier other
// than its numeric ID.
function followUrl(targetAccountUsername: string): string {
  return `https://x.com/${targetAccountUsername}`
}

function postUrl(targetPostId: string): string {
  return `https://x.com/i/web/status/${targetPostId}`
}

// Root takes `ref` + tabIndex={-1} from the caller — the orchestrator owns
// one focus-on-mount callback for every step in the main form (the sign-in
// button, InviteCodeGate, this) and threads it into whichever one is
// currently rendered. This step is reached either from the invite-code
// gate (verified/skipped) or, once, straight after sign-in with nothing to
// gate on.
export function TaskListStep({
  ref,
  username,
  status,
  dwell,
  walletAddress,
  onChangeWallet,
  walletFormatInvalid,
  walletRejectedByServer,
  canSubmit,
  onSubmit,
  submitting,
  submitError,
  result,
  resultIsPositive,
  onChangeCode,
}: {
  ref?: React.Ref<HTMLDivElement>
  username: string | undefined
  status: StatusResponse | null
  dwell: TaskDwell
  walletAddress: string
  onChangeWallet: (value: string) => void
  walletFormatInvalid: boolean
  walletRejectedByServer: boolean
  canSubmit: boolean
  onSubmit: () => void
  submitting: boolean
  submitError: string | null
  result: ValidateResponse | null
  resultIsPositive: boolean
  onChangeCode: () => void
}) {
  const walletHasError = walletFormatInvalid || walletRejectedByServer

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className="flex animate-fade-up flex-col gap-5 outline-none"
    >
      <SignedInBar username={username} />

      <div className="flex flex-col gap-3">
        <TaskRow
          label="Follow the account"
          status={dwell.follow}
          href={status ? followUrl(status.targetAccountUsername) : null}
          buttonLabel="Follow"
          onOpen={dwell.openFollow}
        />
        <TaskRow
          label="Like & repost the announcement"
          status={dwell.likeRepost}
          href={status ? postUrl(status.targetPostId) : null}
          buttonLabel="Like & Repost"
          onOpen={dwell.openLikeRepost}
        />
        <TaskRow
          label="Comment on the post"
          status={dwell.comment}
          href={status ? postUrl(status.targetPostId) : null}
          buttonLabel="Comment"
          onOpen={dwell.openComment}
        />
      </div>

      <div className="flex flex-col gap-2 border-t border-(--khaki-70) pt-4">
        <label
          htmlFor="wallet"
          className="text-caption font-semibold tracking-wider text-(--neutral-30) uppercase"
        >
          Wallet address
        </label>
        <input
          id="wallet"
          type="text"
          value={walletAddress}
          onChange={(e) => onChangeWallet(e.target.value)}
          placeholder="0x..."
          aria-invalid={walletHasError}
          aria-describedby={walletHasError ? 'wallet-error' : undefined}
          className={`rounded-xl border bg-white px-4 py-3 font-mono text-small text-(--neutral-10) shadow-sm transition-colors duration-200 placeholder:text-(--neutral-30)/60 focus:outline-none ${
            walletHasError
              ? 'border-(--primary-red) focus:ring-1 focus:ring-(--primary-red)/50'
              : 'border-(--neutral-40) focus:border-(--primary-green) focus:ring-1 focus:ring-(--primary-green)/50'
          }`}
        />
        {walletHasError && (
          <p
            id="wallet-error"
            className="animate-fade-in text-caption text-(--primary-red)"
          >
            Not a valid wallet address. Check it and try again.
          </p>
        )}
      </div>

      <ResultPanel
        submitError={submitError}
        result={result}
        resultIsPositive={resultIsPositive}
        onChangeCode={onChangeCode}
      />

      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        className={`w-full ${PRIMARY_BUTTON}`}
      >
        {submitting ? 'Checking…' : 'Validate & Submit'}
      </button>
    </div>
  )
}
