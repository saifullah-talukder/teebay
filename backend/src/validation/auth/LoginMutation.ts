import { z } from 'zod'
import { validateRequestPayload } from '../../middleware/ValidateRequestPayload'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type LoginPayload = z.infer<typeof loginSchema>
export const validateLoginPayload = validateRequestPayload(loginSchema)
