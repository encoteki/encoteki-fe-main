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

// The standard "share" glyph (arrow escaping an open tray) — this button
// hands off to the OS share sheet, which can route to any app the visitor
// picks, not just one platform, so it gets a generic share mark rather
// than a specific app's logo.
export function ShareIcon({
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
      <path d="M12 15V4" />
      <path d="M7.5 8.5 12 4l4.5 4.5" />
      <path d="M5 13v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
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

// The X (Twitter) brand mark — deliberately a separate component from
// XIcon above, which is an unrelated close/dismiss glyph used for failure
// marks elsewhere in this UI. Do not reuse XIcon for the "Share to X"
// button; the two happen to share a name but mean different things.
export function XLogoIcon({
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
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}
