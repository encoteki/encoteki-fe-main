import { z } from 'zod'

const LetterSchema = z.enum(['A', 'B', 'C', 'D', 'E', 'F'])

export const QuizSubmitSchema = z.object({
  answers: z.array(LetterSchema).length(6),
  tiebreakAnswer: LetterSchema.optional(),
})

export type QuizSubmitInput = z.infer<typeof QuizSubmitSchema>
