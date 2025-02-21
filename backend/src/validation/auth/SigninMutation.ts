import { z } from 'zod'
import { validateRequestPayload } from '../../middleware/ValidateRequestPayload'

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type SigninPayload = z.infer<typeof signinSchema>
export const validateSigninPayload = validateRequestPayload(signinSchema)
