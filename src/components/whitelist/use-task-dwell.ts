'use client'

import { useEffect, useState } from 'react'
import { dwellStatus } from '@/lib/whitelist/task-dwell'

// Storing the click TIMESTAMP rather than a boolean is what lets a row
// survive a reload honestly: recomputing elapsed time against the original
// click means a row clicked 30 seconds ago comes back done, and one clicked
// 5 seconds ago comes back with 15 seconds left, instead of either granting
// the task instantly or restarting the full dwell. Draft restore (in
// whitelist-flow.tsx) sets these directly via the raw setters below, in a
// post-mount effect — never as a lazy initializer, to avoid a
// server/client hydration mismatch.
export function useTaskDwell() {
  const [followClickedAt, setFollowClickedAt] = useState<number | null>(null)
  // Repost and Like share one row/one dwell — the campaign still wants both
  // actions, but presenting them as a single task instead of two identical
  // "open the same post" buttons.
  const [likeRepostClickedAt, setLikeRepostClickedAt] = useState<number | null>(
    null,
  )
  const [commentClickedAt, setCommentClickedAt] = useState<number | null>(null)
  // Lazy initializer is safe even in this server-rendered component: every
  // clickedAt is null on first render, so every row derives "idle" and
  // server/client markup matches; the first tick (once a row is waiting)
  // corrects it.
  const [now, setNow] = useState(() => Date.now())

  const follow = dwellStatus(followClickedAt, now)
  const likeRepost = dwellStatus(likeRepostClickedAt, now)
  const comment = dwellStatus(commentClickedAt, now)
  const anyWaiting =
    follow === 'waiting' || likeRepost === 'waiting' || comment === 'waiting'
  const allDone =
    follow === 'done' && likeRepost === 'done' && comment === 'done'

  // One shared interval drives all three countdowns, so there is a single
  // thing to clear. It only runs while at least one row is waiting, and
  // stops on its own once all three have either not been clicked or fully
  // elapsed.
  useEffect(() => {
    if (!anyWaiting) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [anyWaiting])

  return {
    followClickedAt,
    likeRepostClickedAt,
    commentClickedAt,
    follow,
    likeRepost,
    comment,
    allDone,
    openFollow: () => setFollowClickedAt((current) => current ?? Date.now()),
    openLikeRepost: () =>
      setLikeRepostClickedAt((current) => current ?? Date.now()),
    openComment: () => setCommentClickedAt((current) => current ?? Date.now()),
    // Exposed for draft restore only — the persistence effect lives in
    // whitelist-flow.tsx because it also spans refcode-gate state and the
    // wallet field, so it can't live inside this single-concern hook.
    setFollowClickedAt,
    setLikeRepostClickedAt,
    setCommentClickedAt,
  }
}

export type TaskDwell = ReturnType<typeof useTaskDwell>
