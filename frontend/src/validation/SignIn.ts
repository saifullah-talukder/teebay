import { z } from 'zod'

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type SigninPayload = z.infer<typeof signinSchema>
