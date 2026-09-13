import type { Letter } from './content'

export type ScoreResult =
  | { status: 'resolved'; letter: Letter }
  | { status: 'needs-tiebreak'; tiedLetters: Letter[] }

// Flat tally: every question's options are in the same fixed A-F order, so
// there's no per-question weighting — just count which letter was picked
// most across all 6 answers (Q6 included in the tally, same as Q1-Q5).
export function scoreMainQuiz(
  answers: [Letter, Letter, Letter, Letter, Letter, Letter],
): ScoreResult {
  const counts = new Map<Letter, number>()
  for (const letter of answers) {
    counts.set(letter, (counts.get(letter) ?? 0) + 1)
  }

  const maxCount = Math.max(...counts.values())
  const candidates = Array.from(counts.entries())
    .filter(([, count]) => count === maxCount)
    .map(([letter]) => letter)

  if (candidates.length === 1) {
    return { status: 'resolved', letter: candidates[0] }
  }

  // Step 1 of the tiebreak: if the Q6 (instrument) answer is one of the
  // tied letters, it wins automatically — no extra screen.
  const q6Answer = answers[5]
  if (candidates.includes(q6Answer)) {
    return { status: 'resolved', letter: q6Answer }
  }

  return { status: 'needs-tiebreak', tiedLetters: candidates }
}

// The follow-up screen only ever offers the still-tied letters, so
// whichever one is picked wins outright — no further resolution needed.
export function resolveTiebreak(letter: Letter): Letter {
  return letter
}
