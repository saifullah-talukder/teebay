import { z } from 'zod'
import { dateSchema } from '../utils/Validation'

export const rentProductSchema = z
  .object({
    startDate: dateSchema,
    endDate: dateSchema,
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.startDate)
    const end = new Date(data.endDate)
    const today = new Date()

    today.setHours(0, 0, 0, 0)
    start.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)

    if (start.getTime() <= today.getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start date has to be in the future',
        path: ['startDate'],
      })
    }

    if (end.getTime() < start.getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start date must be before or equal to end date',
        path: ['startDate'],
      })
    }
  })

export type RentProductPayload = z.infer<typeof rentProductSchema>
