import { z } from 'zod'
import { validateRequestPayload } from '../../middleware/ValidateRequestPayload'

export const updateProductSchema = z.object({
  id: z.string().nonempty('Product ID is required'),
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().optional(),
  rentPrice: z.coerce.number().nullable().optional(),
  isRentable: z.boolean().optional(),
  categories: z.array(z.string().nonempty()).optional(),
})

export type UpdateProductPayload = z.infer<typeof updateProductSchema>
export const validateUpdateProductPayload = validateRequestPayload(updateProductSchema)
