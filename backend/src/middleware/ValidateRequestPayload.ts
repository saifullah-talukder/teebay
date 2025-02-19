import { GraphQLError } from 'graphql'
import { ZodSchema } from 'zod'

export const validateRequestPayload = (schema: ZodSchema) => {
  return (payload: any) => {
    const result = schema.safeParse(payload)
    if (result.success) {
      return result.data
    }

    console.log(result.error.flatten())
    const messages = []
    for (const [key, value] of Object.entries(result.error.flatten().fieldErrors)) {
      messages.push(`${key} - ${value}`)
    }

    const message = messages.length ? messages.join('\n') : 'Validation Error'
    throw new GraphQLError('Failed to fetch categories', {
      extensions: { code: 'UNPROCESSABLE_ENTITY', error: message },
    })
  }
}
