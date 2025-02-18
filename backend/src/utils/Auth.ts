import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'
import { Context } from '../types/Apollo'
import { TokenPayload } from '../types/Auth'

export const JWT_SECRET = process.env.JWT_SECRET!

export function getUserId(context: Context): string {
  const Authorization = context.req.headers.authorization
  if (!Authorization) {
    throw new GraphQLError('Not authenticated', {
      extensions: { code: 'UNAUTHENTICATED' },
    })
  }

  const token = Authorization.replace('Bearer ', '')
  try {
    const { userId } = jwt.verify(token, JWT_SECRET) as TokenPayload
    return String(userId)
  } catch (error) {
    throw new GraphQLError('Invalid token', {
      extensions: { code: 'UNAUTHENTICATED' },
    })
  }
}
