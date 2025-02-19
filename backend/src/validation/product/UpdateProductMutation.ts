import { z } from 'zod'
import { validateRequestPayload } from '../../middleware/ValidateRequestPayload'
import { CreateProductPayload } from './CreateProductMutation'

export const updateProductSchema = z.object({
  id: z.string().nonempty('Product ID is required'),
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.number().nullable().optional(),
  rentPrice: z.number().optional(),
  isRentable: z.boolean().optional(),
  categories: z.array(z.string().nonempty()).optional(),
})

export type UpdateProductPayload = z.infer<typeof updateProductSchema>
export type UpdateProductBody = { id: string } & Partial<CreateProductPayload>
export const validateUpdateProductPayload = validateRequestPayload(updateProductSchema)
