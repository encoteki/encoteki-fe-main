'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import posthog from 'posthog-js'
import {
  QUIZ_QUESTIONS,
  TIEBREAK_PROMPT,
  TIEBREAK_OPTIONS,
  type Letter,
} from '@/lib/quiz/content'
import { scoreMainQuiz } from '@/lib/quiz/scoring'

type Stage =
  | { step: 'question'; index: number; selected: Letter | null }
  | { step: 'tiebreak'; tiedLetters: Letter[]; selected: Letter | null }
  | { step: 'submitting' }

const TOTAL_MAIN_QUESTIONS = 6
const RADIO_GROUP_NAME = 'quiz-option'
const QUIZ_STORAGE_KEY = 'encoteki-quiz-progress'

function optionClass(isSelected: boolean) {
  return `block w-full cursor-pointer rounded-xl border-2 border-(--primary-black) px-5 py-4 text-left font-medium text-(--primary-black) transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--primary-black) ${
    isSelected
      ? 'bg-[#ccf281] shadow-[3px_3px_0px_0px_rgba(26,26,26,1)]'
      : 'bg-white shadow-[0_0_0_0_rgba(26,26,26,1)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(26,26,26,1)]'
  }`
}

export default function QuizPage() {
  const router = useRouter()
  const [answers, setAnswers] = useState<Letter[]>([])
  const [stage, setStage] = useState<Stage>({
    step: 'question',
    index: 0,
    selected: null,
  })
  const [error, setError] = useState<string | null>(null)
  const [selectionRequired, setSelectionRequired] = useState(false)
  const legendRef = useRef<HTMLLegendElement>(null)
  const isFirstRender = useRef(true)

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
  // a stuck loading screen.
  useEffect(() => {
    if (stage.step === 'submitting') return
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
      if (!res.ok) throw new Error('submit failed')
      const data = (await res.json()) as { success: boolean; slug?: string }
      if (!data.success || !data.slug) throw new Error('submit failed')
      posthog.capture('quiz_completed', { character_result: data.slug })
      try {
        sessionStorage.removeItem(QUIZ_STORAGE_KEY)
      } catch {
        // Storage unavailable — nothing to clean up.
      }
      router.push(`/quiz/result/${data.slug}`)
    } catch {
      setError('Something went wrong submitting your quiz — please try again.')
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

  return (
    <main className="home-container flex min-h-screen flex-col items-center justify-center gap-8 bg-(--khaki-90) py-16">
      <div className="w-full max-w-2xl rounded-4xl border-3 border-(--primary-black) bg-[#ffd94a] p-8 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] md:p-12">
        {stage.step !== 'submitting' && (
          <>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={TOTAL_MAIN_QUESTIONS}
              aria-valuenow={
                stage.step === 'question'
                  ? stage.index + 1
                  : TOTAL_MAIN_QUESTIONS
              }
              aria-valuetext={progressLabel}
              className="mb-6 h-2 w-full overflow-hidden rounded-full border-2 border-(--primary-black) bg-white"
            >
              <div
                className="h-full bg-(--primary-green) transition-all duration-300 ease-out"
                style={{ width: progressWidth }}
              />
            </div>
            <p
              aria-hidden="true"
              className="mb-4 font-mono text-xs tracking-widest text-(--primary-black)/70 uppercase"
            >
              {progressLabel}
            </p>
          </>
        )}

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
              ).map(([letter, label]) => (
                <label
                  key={letter}
                  className={optionClass(stage.selected === letter)}
                >
                  <input
                    type="radio"
                    name={RADIO_GROUP_NAME}
                    value={letter}
                    checked={stage.selected === letter}
                    onChange={() => handleSelect(letter)}
                    className="sr-only"
                  />
                  {label}
                </label>
              ))}
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
              {stage.tiedLetters.map((letter) => (
                <label
                  key={letter}
                  className={optionClass(stage.selected === letter)}
                >
                  <input
                    type="radio"
                    name={RADIO_GROUP_NAME}
                    value={letter}
                    checked={stage.selected === letter}
                    onChange={() => handleSelect(letter)}
                    className="sr-only"
                  />
                  {TIEBREAK_OPTIONS[letter]}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {(stage.step === 'question' || stage.step === 'tiebreak') && (
          <>
            {selectionRequired && (
              <p
                role="alert"
                className="mt-4 text-sm font-semibold text-(--red-10)"
              >
                Pick one to continue.
              </p>
            )}
            <div className="mt-8 flex items-center gap-3">
              {canGoBack && (
                <button
                  type="button"
                  onClick={handleBack}
                  aria-label="Back to the previous question"
                  className="shrink-0 rounded-full border-2 border-(--primary-black) bg-white px-6 py-3 text-center text-sm font-black tracking-wider text-(--primary-black) uppercase transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary-black)"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                className="w-full flex-1 rounded-full border-2 border-(--primary-black) bg-(--primary-black) px-6 py-3 text-center text-sm font-black tracking-wider text-white uppercase shadow-[4px_4px_0px_0px_rgba(26,26,26,0.3)] transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:translate-y-1 hover:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary-black) active:translate-y-2"
              >
                Next
              </button>
            </div>
          </>
        )}

        {stage.step === 'submitting' && (
          <p
            role="status"
            aria-live="polite"
            className="text-center font-mono text-sm text-(--primary-black)"
          >
            Finding your Satwas...
          </p>
        )}

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
