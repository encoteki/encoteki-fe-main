import { z } from 'zod'

const MAX_LIMIT = 50

// `.catch()` falls back to the default on any non-numeric, negative, or
// out-of-range input instead of propagating NaN into the Supabase `.range()`
// call, which silently returns zero rows and reports `success: true`.
export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).catch(1),
  limit: z.coerce.number().int().min(1).max(MAX_LIMIT).catch(6),
})

export type Pagination = z.infer<typeof PaginationSchema>
