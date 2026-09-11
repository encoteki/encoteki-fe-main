import { NextRequest, NextResponse } from 'next/server'
import { isRateLimited } from '@/lib/rate-limit'
import { QuizSubmitSchema } from '@/lib/schemas/quiz'
import { scoreMainQuiz, resolveTiebreak } from '@/lib/quiz/scoring'
import { CHARACTERS, type Letter } from '@/lib/quiz/content'

export async function POST(request: NextRequest) {
  if (isRateLimited(request, 'quiz-submit')) {
    return NextResponse.json(
      { success: false, message: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': '60' } },
    )
  }

  const body = await request.json().catch(() => null)
  const parsed = QuizSubmitSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: 'Invalid submission' },
      { status: 400 },
    )
  }

  const { answers, tiebreakAnswer } = parsed.data
  const scored = scoreMainQuiz(
    answers as [Letter, Letter, Letter, Letter, Letter, Letter],
  )

  let finalLetter: Letter
  if (scored.status === 'resolved') {
    finalLetter = scored.letter
  } else {
    // The server recomputes the tied set itself and checks the submitted
    // tiebreak answer against it — never trusts a client-supplied result.
    if (!tiebreakAnswer || !scored.tiedLetters.includes(tiebreakAnswer)) {
      return NextResponse.json(
        { success: false, message: 'Tiebreak answer required or invalid' },
        { status: 400 },
      )
    }
    finalLetter = resolveTiebreak(tiebreakAnswer)
  }

  return NextResponse.json({
    success: true,
    slug: CHARACTERS[finalLetter].slug,
  })
}
