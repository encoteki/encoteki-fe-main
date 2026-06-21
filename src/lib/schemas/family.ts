import { z } from 'zod'

export const FamilySchema = z.object({
  // `id` is a numeric column in the database; coerce to string to match the
  // Family type used across the UI.
  id: z.coerce.string(),
  name: z.string(),
  // Nullable columns in the database: normalise null/undefined to an empty
  // string so a missing value doesn't break parsing of the whole list.
  description: z
    .string()
    .nullish()
    .transform((v) => v ?? ''),
  tags: z
    .string()
    .nullish()
    .transform((v) => v ?? ''),
  image: z
    .string()
    .nullish()
    .transform((v) => v ?? ''),
  link: z
    .string()
    .nullish()
    .transform((v) => v ?? ''),
  is_active: z.boolean(),
})
