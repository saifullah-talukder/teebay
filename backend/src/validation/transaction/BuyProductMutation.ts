import { z } from 'zod'
import { validateRequestPayload } from '../../middleware/ValidateRequestPayload'

export const buyProductSchema = z.object({
  productId: z.string().nonempty('Product ID is required'),
})

export type BuyProductPayload = z.infer<typeof buyProductSchema>
export const validateBuyProductPayload = validateRequestPayload(buyProductSchema)
