import { z } from 'zod'
import { validateRequestPayload } from '../../middleware/ValidateRequestPayload'

export const createProductSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  price: z.number(),
  rentPrice: z.number().nullable(),
  isRentable: z.boolean(),
  categories: z.array(z.string().nonempty()),
})

export type CreateProductPayload = z.infer<typeof createProductSchema>
export const validateCreateProductPayload = validateRequestPayload(createProductSchema)
