// src/lib/quiz/character-handoff.ts
//
// Carries the quiz result's character slug from the result page into the
// whitelist flow, across the full-page redirect that signing in with X
// causes. sessionStorage (not a URL param) survives that redirect because
// the browser tab — and its sessionStorage — stays alive through an
// external OAuth round trip; a query param on /whitelist would not
// (next-auth's callback lands back on whatever `callbackUrl` was set, and
// preserving a query param through that is extra plumbing this doesn't
// need when sessionStorage already does the job).
const QUIZ_CHARACTER_STORAGE_KEY = 'encoteki-quiz-character'

export function saveQuizCharacterForWhitelist(slug: string): void {
  try {
    sessionStorage.setItem(QUIZ_CHARACTER_STORAGE_KEY, slug)
  } catch {
    // Storage unavailable/full (e.g. private browsing) — the whitelist flow
    // just won't have a character to attach; not fatal, matches how the
    // whitelist feature's own draft persistence already treats this.
  }
}

export function readQuizCharacterForWhitelist(): string | null {
  try {
    return sessionStorage.getItem(QUIZ_CHARACTER_STORAGE_KEY)
  } catch {
    return null
  }
}

// Called once the handoff has done its job — a successful submit (attached
// to that entry server-side) or a sign-out (the account boundary this tab
// is about to cross). Without this, the slug sits in sessionStorage
// indefinitely and leaks onto a second, quiz-less account signing in in the
// same tab.
export function clearQuizCharacterForWhitelist(): void {
  try {
    sessionStorage.removeItem(QUIZ_CHARACTER_STORAGE_KEY)
  } catch {
    // Storage unavailable — nothing to clear.
  }
}
