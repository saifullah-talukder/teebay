import { z } from 'zod'

export const createProductSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  price: z.coerce.number(),
  rentPrice: z.coerce.number().nullable(),
  isRentable: z.boolean(),
  categories: z.array(z.string().nonempty()).nonempty(),
})

export type CreateProductPayload = z.infer<typeof createProductSchema>
