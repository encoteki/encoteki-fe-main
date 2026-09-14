import { CheckIcon, ExternalLinkIcon, SpinnerIcon } from './icons'

// One row for Follow/Repost/Like. `href` is `null` until `status` (the
// /api/whitelist/status response) has loaded — the row's label/caption
// always render, but its action button appears only once there's a real
// link to open.
export function TaskRow({
  label,
  status,
  href,
  buttonLabel,
  onOpen,
}: {
  label: string
  status: 'idle' | 'waiting' | 'done'
  href: string | null
  buttonLabel: string
  onOpen: () => void
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl border p-3 transition-colors duration-300 ${
        status === 'done'
          ? 'border-(--primary-green) bg-(--green-90)'
          : 'border-(--neutral-40) bg-white'
      }`}
    >
      <p
        className="flex min-w-0 items-center gap-1.5 text-small font-semibold text-(--neutral-10)"
        aria-live="polite"
      >
        {status === 'waiting' && <SpinnerIcon />}
        {status === 'done' && (
          <CheckIcon className="shrink-0 animate-check-pop text-(--primary-green)" />
        )}
        {label}
        {status === 'done' && <span className="sr-only"> — done</span>}
      </p>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onOpen}
          className="flex min-h-11 shrink-0 items-center gap-1 rounded-full bg-(--primary-green) px-4 py-2.5 text-caption font-semibold text-white transition-[background-color,transform] duration-300 hover:bg-(--green-10) active:scale-95"
        >
          {buttonLabel}
          <ExternalLinkIcon />
        </a>
      )}
    </div>
  )
}
