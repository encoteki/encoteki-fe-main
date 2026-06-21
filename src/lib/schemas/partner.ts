import { z } from 'zod'

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
  // Neutralise any non-http(s) value (e.g. `javascript:` URIs) to an empty
  // string rather than throwing — a single bad row must not break the whole
  // list. Defence-in-depth on top of React/Next's own URL sanitisation.
  store_url: z.string().transform((v) => (/^https?:\/\//i.test(v) ? v : '')),
  is_offline: z.boolean(),
  is_active: z.boolean(),
})
