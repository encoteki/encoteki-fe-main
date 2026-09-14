// A task row turns green this many seconds after its X link is opened,
// rather than on the click itself, so the applicant has time to actually
// follow, repost, or like first.
//
// This is friction, not verification: it runs entirely in the browser, is
// bypassable, and never reaches Supabase. The request still always sends
// followAttested/retweetAttested/likeAttested as true.
export const TASK_DWELL_SECONDS = 20

export type DwellStatus = 'idle' | 'waiting' | 'done'

/**
 * `clickedAt` is the epoch-ms timestamp of the click, or null if the link was
 * never opened. Taking `now` as an argument rather than reading the clock
 * keeps this testable and lets a restored draft be evaluated against the
 * original click time.
 */
export function dwellStatus(
  clickedAt: number | null,
  now: number,
): DwellStatus {
  if (clickedAt === null) return 'idle'
  return now - clickedAt >= TASK_DWELL_SECONDS * 1000 ? 'done' : 'waiting'
}
