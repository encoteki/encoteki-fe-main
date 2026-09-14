import { CheckIcon, XIcon } from './icons'
import type { ValidateResponse } from './types'

// One cell of the failure-state marks grid (Follow/Repost/Like/Wallet).
function Mark({ label, value }: { label: string; value: 'yes' | 'no' }) {
  return (
    <div>
      <dt className="text-(--neutral-30)">{label}</dt>
      <dd
        className={`mt-0.5 flex items-center gap-1 font-semibold ${
          value === 'yes' ? 'text-(--primary-green)' : 'text-(--neutral-10)'
        }`}
      >
        {value === 'yes' ? (
          <CheckIcon className="animate-check-pop" />
        ) : (
          <XIcon className="text-(--primary-red)" />
        )}
        {value}
      </dd>
    </div>
  )
}

export function ResultPanel({
  submitError,
  result,
  resultIsPositive,
  onChangeCode,
}: {
  submitError: string | null
  result: ValidateResponse | null
  resultIsPositive: boolean
  onChangeCode: () => void
}) {
  return (
    <div aria-live="polite" className="flex flex-col gap-3 empty:hidden">
      {submitError && (
        <p
          role="alert"
          className="flex animate-fade-up items-center justify-center gap-1.5 rounded-xl border border-(--primary-red)/20 bg-(--red-90) p-3 text-center text-caption font-medium text-(--neutral-10)"
        >
          <XIcon className="shrink-0 text-(--primary-red)" />
          {submitError}
        </p>
      )}

      {result && (
        <div
          className={`animate-fade-up rounded-xl border p-4 ${
            resultIsPositive
              ? 'border-(--primary-green)/30 bg-(--green-90)'
              : 'border-(--primary-red)/20 bg-(--red-90)'
          }`}
        >
          {/* The marks grid only means something for the generic "you
              didn't finish something" failure (reason === null) — every
              other reason (duplicate account, duplicate wallet, invalid
              code) happens AFTER all four marks already passed, so showing
              four green checks alongside a red error message would just
              contradict the message instead of explaining it. */}
          {!result.ok && result.reason === null && (
            <dl className="grid grid-cols-4 gap-2 text-caption">
              <Mark label="Follow" value={result.marks.follow} />
              <Mark label="Repost" value={result.marks.repost} />
              <Mark label="Like" value={result.marks.like} />
              <Mark label="Wallet" value={result.marks.wallet} />
            </dl>
          )}

          {result.ok ? (
            <p className="text-body font-semibold text-(--primary-green)">
              You&apos;re eligible for the whitelist.
            </p>
          ) : result.reason === 'duplicate_x_account' &&
            result.spotNumber !== null ? (
            <p className="text-small font-semibold text-(--primary-green)">
              You&apos;re already whitelisted — spot #{result.spotNumber}.
            </p>
          ) : result.reason === 'duplicate_wallet' ? (
            <p className="flex items-center gap-1.5 text-small font-semibold text-(--neutral-10)">
              <XIcon className="shrink-0 text-(--primary-red)" />
              This wallet address already claimed a spot under a different X
              account. Try a different wallet.
            </p>
          ) : result.reason === 'referral_code_invalid' ? (
            <div className="flex flex-col items-center gap-1.5 text-center text-small font-semibold text-(--neutral-10)">
              <span className="flex items-center gap-1.5">
                <XIcon className="shrink-0 text-(--primary-red)" />
                This invite code is no longer valid.
              </span>
              <button
                onClick={onChangeCode}
                className="cursor-pointer text-caption font-semibold text-(--primary-green) underline underline-offset-2 hover:text-(--green-10)"
              >
                Change code
              </button>
            </div>
          ) : (
            <p className="mt-3 flex items-center gap-1.5 text-small font-semibold text-(--neutral-10)">
              <XIcon className="shrink-0 text-(--primary-red)" />
              Not eligible yet. Fix the items marked above and try again.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
