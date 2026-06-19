import { z } from 'zod'

export const PartnerSchema = z.object({
  id: z.number(),
  name: z.string(),
  offer: z.string(),
  description: z.string(),
  tnc: z.string(),
  image: z.string(),
  store_url: z.string(),
  is_offline: z.boolean(),
  is_active: z.boolean(),
})
