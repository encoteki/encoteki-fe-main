import { z } from 'zod'

// Neutralise any non-http(s) value (e.g. `javascript:`, `data:` URIs) to an
// empty string rather than throwing — a single bad row must not break the
// whole list. Defence-in-depth on top of React/Next's own URL sanitisation.
export const httpUrl = z
  .string()
  .transform((v) => (/^https?:\/\//i.test(v) ? v : ''))

export const httpUrlNullish = z
  .string()
  .nullish()
  .transform((v) => (v && /^https?:\/\//i.test(v) ? v : ''))
