import { z } from 'zod'
import { validateRequestPayload } from '../../middleware/ValidateRequestPayload'

export const deleteProductSchema = z.object({
  id: z.string().nonempty('Product ID is required'),
})

export type DeleteProductPayload = z.infer<typeof deleteProductSchema>
export const validateDeleteProductPayload = validateRequestPayload(deleteProductSchema)
