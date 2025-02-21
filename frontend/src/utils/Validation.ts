import { z } from 'zod'

export const phoneSchema = z
  .string()
  .regex(
    /^(?:\+880|880|0)\d{10}$/,
    'Invalid Bangladeshi phone number. It must start with +880, 880, or 0, followed by 10 digits.'
  )
