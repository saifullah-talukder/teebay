import { z } from 'zod'
import { validateRequestPayload } from '../../middleware/ValidateRequestPayload'

export const rentalsByProductSchema = z.object({
  productId: z.string().nonempty('Product ID is required'),
})

export type RentalsByProductPayload = z.infer<typeof rentalsByProductSchema>
export const validateRentalsByProductPayload = validateRequestPayload(rentalsByProductSchema)
