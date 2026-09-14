'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, Check } from 'lucide-react'
import posthog from 'posthog-js'
import {
  CHARACTERS,
  QUIZ_QUESTIONS,
  TIEBREAK_PROMPT,
  TIEBREAK_OPTIONS,
  type Letter,
} from '@/lib/quiz/content'
import { scoreMainQuiz } from '@/lib/quiz/scoring'
import ResultActions from '@/components/quiz/result-actions'
import type { StatusResponse } from '@/components/whitelist/types'

type Stage =
  | { step: 'question'; index: number; selected: Letter | null }
  | { step: 'tiebreak'; tiedLetters: Letter[]; selected: Letter | null }
  | { step: 'submitting' }
  // The result is shown in-place, not at a shareable URL — closing the
  // route means there's nothing to bookmark, revisit, or guess. Once the
  // visitor navigates away (or reloads), this state is gone for good; the
  // progress-persistence effect below deliberately never saves it.
  | { step: 'result'; slug: string }

const TOTAL_MAIN_QUESTIONS = 6
const RADIO_GROUP_NAME = 'quiz-option'
const QUIZ_STORAGE_KEY = 'encoteki-quiz-progress'

function optionClass(isSelected: boolean) {
  return `flex w-full cursor-pointer items-start gap-3 rounded-2xl border-2 border-(--primary-black) px-5 py-4 text-left font-medium text-(--primary-black) transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--primary-black) ${
    isSelected
      ? 'bg-[#ccf281] shadow-[3px_3px_0px_0px_rgba(26,26,26,1)]'
      : 'bg-white shadow-[0_0_0_0_rgba(26,26,26,1)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(26,26,26,1)]'
  }`
}

function Checkbox({ selected }: { selected: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-(--primary-black) transition-colors duration-200 ${
        selected ? 'bg-(--primary-black)' : 'bg-white'
      }`}
    >
      {selected && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
    </span>
  )
}

export default function QuizPage() {
  const [answers, setAnswers] = useState<Letter[]>([])
  const [stage, setStage] = useState<Stage>({
    step: 'question',
    index: 0,
    selected: null,
  })
  const [error, setError] = useState<string | null>(null)
  const [selectionRequired, setSelectionRequired] = useState(false)
  // True for a visitor who is already signed in and already whitelisted,
  // but whose entry has no character yet — the "went straight to
  // whitelist, never took the quiz" case this mode exists for. Checked
  // once, independent of quiz progress, since it only depends on account
  // state, not on anything answered here.
  const [linkToWhitelist, setLinkToWhitelist] = useState(false)
  const [linkStatus, setLinkStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle')
  const legendRef = useRef<HTMLLegendElement>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    fetch('/api/whitelist/status')
      .then((res) => (res.ok ? (res.json() as Promise<StatusResponse>) : null))
      .then((data) => {
        if (data?.existingEntry && data.existingEntry.characterSlug === null) {
          setLinkToWhitelist(true)
        }
      })
      .catch(() => {
        // Not linked — falls back to the normal quiz → signup handoff below.
      })
  }, [])

  // Rehydrate any in-progress attempt (refresh, accidental tab close) once,
  // on mount. Reading storage during the initial render would desync
  // server and client HTML, so this waits for the client-only effect pass.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(QUIZ_STORAGE_KEY)
      if (!raw) return
      const saved = JSON.parse(raw) as { answers?: Letter[]; stage?: Stage }
      if (
        Array.isArray(saved.answers) &&
        saved.stage &&
        saved.stage.step !== 'submitting'
      ) {
        setAnswers(saved.answers)
        setStage(saved.stage)
      }
    } catch {
      // Corrupt or inaccessible storage — start fresh.
    }
  }, [])

  // Persist progress after every change so a refresh or accidental tab
  // close doesn't cost the visitor all six answers. The transient
  // `submitting` stage is skipped so a crashed session never restores into
  // a stuck loading screen. `result` is skipped too, deliberately — a
  // finished result is meant to disappear the moment the visitor leaves,
  // not survive a reload.
  useEffect(() => {
    if (stage.step === 'submitting' || stage.step === 'result') return
    try {
      sessionStorage.setItem(
        QUIZ_STORAGE_KEY,
        JSON.stringify({ answers, stage }),
      )
    } catch {
      // Storage unavailable (private mode, quota) — progress just won't persist.
    }
  }, [answers, stage])

  const stepKey =
    stage.step === 'question' ? `question-${stage.index}` : stage.step

  // Move focus to the new question/tiebreak prompt on every advance, so a
  // keyboard or screen-reader user isn't left on a Next button that just
  // unmounted (disabled buttons drop out of the tab order) with no
  // indication anything changed. Skipped on first mount so the page
  // doesn't steal focus from wherever the visitor actually landed.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (stage.step !== 'submitting') legendRef.current?.focus()
  }, [stepKey, stage.step])

  async function submit(finalAnswers: Letter[], tiebreakAnswer?: Letter) {
    setStage({ step: 'submitting' })
    setError(null)
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers, tiebreakAnswer }),
      })
      if (res.status === 429) throw new Error('rate-limited')
      if (!res.ok) throw new Error('submit failed')
      const data = (await res.json()) as { success: boolean; slug?: string }
      if (!data.success || !data.slug) throw new Error('submit failed')
      posthog.capture('quiz_completed', { character_result: data.slug })
      try {
        sessionStorage.removeItem(QUIZ_STORAGE_KEY)
      } catch {
        // Storage unavailable — nothing to clean up.
      }
      setStage({ step: 'result', slug: data.slug })
    } catch (err) {
      // The 429 case gets its own message — the generic one tells a
      // rate-limited visitor to do the one thing that can't work yet.
      setError(
        err instanceof Error && err.message === 'rate-limited'
          ? "You're going a bit fast — wait a moment and try again."
          : 'Something went wrong submitting your quiz — please try again.',
      )
      if (tiebreakAnswer !== undefined) {
        // Failure was on the tiebreak submit — stay on the tiebreak step
        // instead of bouncing the user back to a Q6 they already
        // answered. `finalAnswers` (len 6) is unchanged by this path, so
        // re-scoring it reproduces the same tie deterministically.
        const scored = scoreMainQuiz(
          finalAnswers as [Letter, Letter, Letter, Letter, Letter, Letter],
        )
        setStage({
          step: 'tiebreak',
          tiedLetters:
            scored.status === 'needs-tiebreak' ? scored.tiedLetters : [],
          selected: tiebreakAnswer,
        })
      } else {
        // Failure was on the main-flow Q6 submit. Revert `answers` to
        // before this attempt's Q6 pick was appended, so retrying
        // re-enters handleNext's "fresh answer" branch instead of
        // appending a 7th element on top of the 6 already recorded
        // (which the server's 6-length schema would then reject forever).
        setAnswers((prev) => prev.slice(0, 5))
        setStage({
          step: 'question',
          index: 5,
          selected: finalAnswers[5] ?? null,
        })
      }
    }
  }

  const saveCharacterLink = useCallback((slug: string) => {
    setLinkStatus('saving')
    fetch('/api/whitelist/character', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ characterSlug: slug }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('link failed')
        setLinkStatus('saved')
      })
      .catch(() => setLinkStatus('error'))
  }, [])

  // Fires once, the moment this mode's result is ready — the whole point
  // is that the visitor never has to do anything for it to happen ("sembari
  // show character card ui"). Depends on the whole `stage` object (not
  // e.g. `stage.step`), matching the persistence effect above, since a
  // fresh object is exactly what marks a genuine transition into 'result'.
  useEffect(() => {
    if (stage.step !== 'result' || !linkToWhitelist) return
    saveCharacterLink(stage.slug)
  }, [stage, linkToWhitelist, saveCharacterLink])

  function handleSelect(letter: Letter) {
    setSelectionRequired(false)
    if (stage.step === 'question') {
      setStage({ ...stage, selected: letter })
    } else if (stage.step === 'tiebreak') {
      setStage({ ...stage, selected: letter })
    }
  }

  function handleNext() {
    if (stage.step !== 'question' && stage.step !== 'tiebreak') return
    if (!stage.selected) {
      setSelectionRequired(true)
      return
    }

    if (stage.step === 'question') {
      if (stage.index === 0) posthog.capture('quiz_started')

      const nextAnswers = [...answers, stage.selected]
      setAnswers(nextAnswers)

      if (nextAnswers.length < TOTAL_MAIN_QUESTIONS) {
        setStage({ step: 'question', index: stage.index + 1, selected: null })
        return
      }

      const scored = scoreMainQuiz(
        nextAnswers as [Letter, Letter, Letter, Letter, Letter, Letter],
      )
      if (scored.status === 'resolved') {
        submit(nextAnswers)
      } else {
        setStage({
          step: 'tiebreak',
          tiedLetters: scored.tiedLetters,
          selected: null,
        })
      }
    } else {
      submit(answers, stage.selected)
    }
  }

  function handleBack() {
    if (stage.step === 'question' && stage.index > 0) {
      const prevIndex = stage.index - 1
      setAnswers((prev) => prev.slice(0, prevIndex))
      setStage({
        step: 'question',
        index: prevIndex,
        selected: answers[prevIndex] ?? null,
      })
    } else if (stage.step === 'tiebreak') {
      const prevIndex = TOTAL_MAIN_QUESTIONS - 1
      setAnswers((prev) => prev.slice(0, prevIndex))
      setStage({
        step: 'question',
        index: prevIndex,
        selected: answers[prevIndex] ?? null,
      })
    }
    setSelectionRequired(false)
    setError(null)
  }

  function handleRetake() {
    setAnswers([])
    setStage({ step: 'question', index: 0, selected: null })
  }

  const canGoBack =
    stage.step === 'tiebreak' || (stage.step === 'question' && stage.index > 0)

  const progressLabel =
    stage.step === 'question'
      ? `${stage.index + 1} of ${TOTAL_MAIN_QUESTIONS}`
      : stage.step === 'tiebreak'
        ? 'Bonus question'
        : ''

  const progressWidth =
    stage.step === 'question'
      ? `${((stage.index + 1) / TOTAL_MAIN_QUESTIONS) * 100}%`
      : '100%'

  // The loading moment has no card chrome around it — it isn't a step in
  // the fieldset flow, it's the pause between answering and finding out,
  // so it gets the bare page instead of being squeezed into the question
  // card's box (which would otherwise visibly collapse to a fraction of
  // its height for the duration).
  if (stage.step === 'submitting') {
    return (
      <main className="home-container flex min-h-screen flex-col items-center justify-center bg-(--khaki-90)">
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center gap-6"
        >
          <div className="flex items-center gap-3">
            {Object.values(CHARACTERS).map((character, i) => (
              <span
                key={character.slug}
                aria-hidden="true"
                className="motion-safe:animate-satwas-pulse h-4 w-4 rounded-full"
                style={{
                  backgroundColor: character.cardPlaceholderColor,
                  animationDelay: `${i * 120}ms`,
                }}
              />
            ))}
          </div>
          <p className="font-mono text-sm tracking-wide text-(--primary-black)">
            Finding your Satwas...
          </p>
        </div>
      </main>
    )
  }

  // Shown once, right here, immediately after finishing — never at a URL
  // of its own. There is nothing to link to: no `/quiz/result/[slug]`
  // route exists, so a result can't be bookmarked, revisited, or guessed
  // by anyone who didn't just take the quiz. Sharing happens only through
  // the card-art download below, never through a link back to this view.
  if (stage.step === 'result') {
    const character = Object.values(CHARACTERS).find(
      (c) => c.slug === stage.slug,
    )
    // Structurally unreachable — the server only ever returns a slug from
    // this same CHARACTERS map — but retake rather than crash if it ever is.
    if (!character) {
      handleRetake()
      return null
    }

    return (
      <main className="home-container flex min-h-screen flex-col items-center justify-center bg-(--khaki-90) text-center">
        {/* The card art already carries the name, animal, MBTI, instrument,
            title, and quote as part of its illustration — an h1 stays for
            heading navigation and SEO without duplicating that text visibly. */}
        <h1 className="sr-only">
          {character.name} — {character.title}
        </h1>
        <p className="font-mono text-xs tracking-widest text-(--neutral-30) uppercase">
          You are
        </p>
        <Image
          src={character.cardImage}
          alt={`${character.name} — ${character.animal}, ${character.mbti}, ${character.title}. Plays ${character.instrument}.`}
          className="mt-4 w-72 rounded-2xl border-2 border-(--primary-black) sm:w-96"
          priority
        />

        {linkToWhitelist && (
          <div className="mt-4" aria-live="polite">
            {linkStatus === 'saving' && (
              <p className="text-sm font-medium text-(--neutral-30)">
                Saving your Satwas to your whitelist spot…
              </p>
            )}
            {linkStatus === 'saved' && (
              <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-(--primary-green)">
                <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                Saved to your whitelist spot
              </p>
            )}
            {linkStatus === 'error' && (
              <div className="flex flex-col items-center gap-2">
                <p
                  role="alert"
                  className="text-sm font-semibold text-(--red-10)"
                >
                  Couldn&apos;t save your Satwas to your whitelist spot.
                </p>
                <button
                  type="button"
                  onClick={() => saveCharacterLink(stage.slug)}
                  className="cursor-pointer text-sm font-semibold text-(--primary-black) underline decoration-2 underline-offset-4 hover:text-(--primary-green) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary-black)"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        )}

        <ResultActions
          character={character}
          linkedToWhitelist={linkToWhitelist}
        />

        {/* Retaking would imply the saved character above could change —
            it can't (the API this mode uses is set-once), so the retake
            path is hidden here rather than left to fail confusingly. */}
        {!linkToWhitelist && (
          <button
            type="button"
            onClick={handleRetake}
            className="mt-6 cursor-pointer text-sm font-semibold text-(--primary-black) underline decoration-2 underline-offset-4 hover:text-(--primary-green) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary-black)"
          >
            Retake the quiz
          </button>
        )}
      </main>
    )
  }

  return (
    <main className="home-container flex min-h-screen flex-col items-center justify-center bg-(--khaki-90)">
      <div className="w-full max-w-2xl rounded-4xl border-3 border-(--primary-black) bg-(--khaki-70) p-8 md:p-12">
        <h1 className="sr-only">Which Satwas Are You?</h1>
        <div className="mb-6 flex items-center gap-4">
          {canGoBack ? (
            <button
              type="button"
              onClick={handleBack}
              aria-label="Back to the previous question"
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-(--primary-black) transition-colors duration-200 hover:bg-(--primary-black)/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary-black)"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
            </button>
          ) : (
            <span className="h-10 w-10 shrink-0" aria-hidden="true" />
          )}
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={TOTAL_MAIN_QUESTIONS}
            aria-valuenow={
              stage.step === 'question' ? stage.index + 1 : TOTAL_MAIN_QUESTIONS
            }
            aria-valuetext={progressLabel}
            className="h-2 w-full overflow-hidden rounded-full border-2 border-(--primary-black) bg-white"
          >
            <div
              className="h-full bg-(--primary-green) transition-all duration-300 ease-out"
              style={{ width: progressWidth }}
            />
          </div>
        </div>
        <p
          aria-hidden="true"
          className="mb-4 font-mono text-xs tracking-widest text-(--primary-black)/70 uppercase"
        >
          {progressLabel}
        </p>

        {stage.step === 'question' && (
          <fieldset>
            <legend
              ref={legendRef}
              tabIndex={-1}
              className="mb-8 text-2xl font-black text-(--primary-black) outline-none md:text-3xl"
            >
              {QUIZ_QUESTIONS[stage.index].prompt}
            </legend>
            <div className="flex flex-col gap-3">
              {(
                Object.entries(QUIZ_QUESTIONS[stage.index].options) as [
                  Letter,
                  string,
                ][]
              ).map(([letter, label]) => {
                const isSelected = stage.selected === letter
                return (
                  <label key={letter} className={optionClass(isSelected)}>
                    <input
                      type="radio"
                      name={RADIO_GROUP_NAME}
                      value={letter}
                      checked={isSelected}
                      onChange={() => handleSelect(letter)}
                      className="sr-only"
                    />
                    <Checkbox selected={isSelected} />
                    {label}
                  </label>
                )
              })}
            </div>
          </fieldset>
        )}

        {stage.step === 'tiebreak' && (
          <fieldset>
            <legend
              ref={legendRef}
              tabIndex={-1}
              className="mb-8 text-2xl font-black text-(--primary-black) outline-none md:text-3xl"
            >
              {TIEBREAK_PROMPT}
            </legend>
            <div className="flex flex-col gap-3">
              {stage.tiedLetters.map((letter) => {
                const isSelected = stage.selected === letter
                return (
                  <label key={letter} className={optionClass(isSelected)}>
                    <input
                      type="radio"
                      name={RADIO_GROUP_NAME}
                      value={letter}
                      checked={isSelected}
                      onChange={() => handleSelect(letter)}
                      className="sr-only"
                    />
                    <Checkbox selected={isSelected} />
                    {TIEBREAK_OPTIONS[letter]}
                  </label>
                )
              })}
            </div>
          </fieldset>
        )}

        {selectionRequired && (
          <p
            role="alert"
            className="mt-4 text-sm font-semibold text-(--red-10)"
          >
            Pick one to continue.
          </p>
        )}
        <button
          type="button"
          onClick={handleNext}
          className="mt-8 w-full cursor-pointer rounded-full border-2 border-(--primary-black) bg-(--primary-black) px-6 py-3 text-center text-sm font-black tracking-wider text-white uppercase shadow-[4px_4px_0px_0px_rgba(26,26,26,0.3)] transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:translate-y-1 hover:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary-black) active:translate-y-2"
        >
          Next
        </button>

        {error && (
          <p
            className="mt-6 text-sm font-semibold text-(--red-10)"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    </main>
  )
}
