import { z } from 'zod'

export const editProductSchema = z.object({
  id: z.string().nonempty('Product ID is required'),
  title: z.string(),
  description: z.string(),
  price: z.coerce.number(),
  rentPrice: z.coerce.number().nullable(),
  isRentable: z.boolean(),
  categories: z.array(z.string().nonempty()).nonempty(),
})

export type EditProductPayload = z.infer<typeof editProductSchema>
