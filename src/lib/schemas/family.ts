import { z } from 'zod'

export const FamilySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  tags: z.string(),
  image: z.string(),
  link: z.string().default(''),
  is_active: z.boolean(),
})
