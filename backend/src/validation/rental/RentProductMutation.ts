import { z } from 'zod'
import { validateRequestPayload } from '../../middleware/ValidateRequestPayload'

export const rentProductSchema = z.object({
  productId: z.string().nonempty('Product ID is required'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
})

export type RentProductPayload = z.infer<typeof rentProductSchema>
export const validateRentProductPayload = validateRequestPayload(rentProductSchema)
