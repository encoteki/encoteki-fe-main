'use client'

import { useState } from 'react'
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

function optionClass(isSelected: boolean) {
  return `w-full rounded-xl border-2 border-(--primary-black) px-5 py-4 text-left font-medium text-(--primary-black) transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary-black) ${
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
      router.push(`/quiz/result/${data.slug}`)
    } catch {
      setError('Something went wrong submitting your quiz — please try again.')
      // Revert `answers` to before this attempt's Q6 (or tiebreak) pick was
      // appended, so retrying re-enters handleNext's "fresh answer" branch
      // instead of appending a 7th element on top of the 6 already recorded
      // (which the server's 6-length schema would then reject forever).
      setAnswers((prev) => prev.slice(0, 5))
      setStage({
        step: 'question',
        index: 5,
        selected: finalAnswers[5] ?? null,
      })
    }
  }

  function handleSelect(letter: Letter) {
    if (stage.step === 'question') {
      setStage({ ...stage, selected: letter })
    } else if (stage.step === 'tiebreak') {
      setStage({ ...stage, selected: letter })
    }
  }

  function handleNext() {
    if (stage.step === 'question' && stage.selected) {
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
    } else if (stage.step === 'tiebreak' && stage.selected) {
      submit(answers, stage.selected)
    }
  }

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
            <div className="mb-6 h-2 w-full overflow-hidden rounded-full border-2 border-(--primary-black) bg-white">
              <div
                className="h-full bg-(--primary-green) transition-all duration-300 ease-out"
                style={{ width: progressWidth }}
              />
            </div>
            <p className="mb-4 font-mono text-xs tracking-widest text-(--primary-black)/70 uppercase">
              {progressLabel}
            </p>
          </>
        )}

        {stage.step === 'question' && (
          <fieldset>
            <legend className="mb-8 text-2xl font-black text-(--primary-black) md:text-3xl">
              {QUIZ_QUESTIONS[stage.index].prompt}
            </legend>
            <div className="flex flex-col gap-3" role="radiogroup">
              {(
                Object.entries(QUIZ_QUESTIONS[stage.index].options) as [
                  Letter,
                  string,
                ][]
              ).map(([letter, label]) => (
                <button
                  key={letter}
                  type="button"
                  role="radio"
                  aria-checked={stage.selected === letter}
                  onClick={() => handleSelect(letter)}
                  className={optionClass(stage.selected === letter)}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {stage.step === 'tiebreak' && (
          <fieldset>
            <legend className="mb-8 text-2xl font-black text-(--primary-black) md:text-3xl">
              {TIEBREAK_PROMPT}
            </legend>
            <div className="flex flex-col gap-3" role="radiogroup">
              {stage.tiedLetters.map((letter) => (
                <button
                  key={letter}
                  type="button"
                  role="radio"
                  aria-checked={stage.selected === letter}
                  onClick={() => handleSelect(letter)}
                  className={optionClass(stage.selected === letter)}
                >
                  {TIEBREAK_OPTIONS[letter]}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {(stage.step === 'question' || stage.step === 'tiebreak') && (
          <button
            type="button"
            onClick={handleNext}
            disabled={!stage.selected}
            className="mt-8 w-full rounded-full border-2 border-(--primary-black) bg-(--primary-black) px-6 py-3 text-center text-sm font-black tracking-wider text-white uppercase shadow-[4px_4px_0px_0px_rgba(26,26,26,0.3)] transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:translate-y-1 hover:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary-black) active:translate-y-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(26,26,26,0.3)]"
          >
            Next
          </button>
        )}

        {stage.step === 'submitting' && (
          <p className="text-center font-mono text-sm text-(--primary-black)">
            Finding your Satwas...
          </p>
        )}

        {error && (
          <p
            className="mt-6 text-sm font-semibold text-(--primary-red)"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    </main>
  )
}
