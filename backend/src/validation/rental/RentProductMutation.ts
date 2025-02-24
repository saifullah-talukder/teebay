import { z } from 'zod'
import { validateRequestPayload } from '../../middleware/ValidateRequestPayload'

const dateSchema = z
  .string()
  .regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/, 'Invalid date format. Must be dd/mm/yyyy.')
  .refine(dateStr => {
    const [day, month, year] = dateStr.split('/').map(Number)
    const date = new Date(year, month - 1, day)
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
  }, 'Invalid date. The date does not exist.')

export const rentProductSchema = z.object({
  productId: z.string().nonempty('Product ID is required'),
  startDate: dateSchema,
  endDate: dateSchema,
})

export type RentProductPayload = z.infer<typeof rentProductSchema>
export const validateRentProductPayload = validateRequestPayload(rentProductSchema)
