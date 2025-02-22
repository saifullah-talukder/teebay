import { z } from 'zod'
import { validateRequestPayload } from '../../middleware/ValidateRequestPayload'

export const signupSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/.*\d.*/, 'Password must contain at least one numric character'),
  firstName: z.string().min(1, 'First name must be minimum 1 character long'),
  lastName: z.string().min(1, 'Last name must be minimum 1 character long'),
  address: z.string().min(3, 'Address must be minimum 3 characters long'),
  phone: z
    .string()
    .regex(
      /^(?:\+880|880|0)\d{10}$/,
      'Invalid Bangladeshi phone number. It must start with +880, 880, or 0, followed by 10 digits.'
    ),
})

export type SignupPayload = z.infer<typeof signupSchema>
export const validateSignupPayload = validateRequestPayload(signupSchema)
