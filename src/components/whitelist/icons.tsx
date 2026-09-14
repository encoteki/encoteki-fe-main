export function ExternalLinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

export function CheckIcon({
  className = '',
  size = 'h-3.5 w-3.5',
}: {
  className?: string
  size?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${size} ${className}`}
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// A paw print, not a generic "speed" glyph — FCFS is about being early, and
// this project is a wildlife one before it's a SaaS one. Solid silhouette
// (unlike the other line icons above) because that's how a paw print
// actually reads at a glance; an outlined version loses the shape.
export function PawIcon({
  className = '',
  size = 'h-3.5 w-3.5',
}: {
  className?: string
  size?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`${size} ${className}`}
      aria-hidden="true"
    >
      <ellipse cx="12" cy="16.2" rx="6" ry="4.6" />
      <circle cx="5.6" cy="10" r="2.15" />
      <circle cx="9.6" cy="6.3" r="2.5" />
      <circle cx="14.4" cy="6.3" r="2.5" />
      <circle cx="18.4" cy="10" r="2.15" />
    </svg>
  )
}

// The camera-and-lens mark, not a generic "share" glyph — this button opens
// Instagram specifically (via the Web Share API's target picker), so it
// gets Instagram's own recognizable shape rather than a bare arrow.
export function InstagramIcon({
  className = '',
  size = 'h-3.5 w-3.5',
}: {
  className?: string
  size?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${size} ${className}`}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function DownloadIcon({
  className = '',
  size = 'h-3.5 w-3.5',
}: {
  className?: string
  size?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${size} ${className}`}
      aria-hidden="true"
    >
      <path d="M12 4v11" />
      <path d="M7.5 11.5 12 16l4.5-4.5" />
      <path d="M5 19h14" />
    </svg>
  )
}

// Shown in the same slot as CheckIcon, while a task row is waiting out its
// 20-second dwell (see src/lib/whitelist/task-dwell.ts). Purely a
// "something is happening" cue — no countdown, no text — so aria-hidden
// like CheckIcon.
export function SpinnerIcon({
  className = '',
  size = 'h-3.5 w-3.5',
}: {
  className?: string
  size?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block ${size} shrink-0 animate-spin rounded-full border-2 border-(--primary-green)/25 border-t-(--primary-green) ${className}`}
    />
  )
}

export function XIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-3.5 w-3.5 ${className}`}
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
