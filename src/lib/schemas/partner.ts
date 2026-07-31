import { z } from 'zod'
import { httpUrl } from '@/lib/schemas/url'

export const PartnerSchema = z.object({
  id: z.number(),
  name: z.string(),
  offer: z.string(),
  description: z.string(),
  // `tnc` is nullable in the database; normalise null/undefined to an empty
  // string so a missing value doesn't break parsing of the whole list.
  tnc: z
    .string()
    .nullish()
    .transform((v) => v ?? ''),
  image: z.string(),
  store_url: httpUrl,
  is_offline: z.boolean(),
  is_active: z.boolean(),
})
