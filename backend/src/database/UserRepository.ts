import { GraphQLError } from 'graphql'
import Repository from './Repository'
import { SignupPayload } from '../validation/auth/SignupMutation'

export class UserRepository extends Repository {
  async findUserByEmail(email: string) {
    try {
      return await this.prismaClient.user.findUnique({
        where: { email },
      })
    } catch (error) {
      throw new GraphQLError('Failed to fetch user by email', {
        extensions: { code: 'DATABASE_ERROR', error: (error as Error).message },
      })
    }
  }

  async createNewUser(singupPayload: SignupPayload) {
    try {
      return await this.prismaClient.user.create({
        data: singupPayload,
      })
    } catch (error) {
      throw new GraphQLError('Failed to save user to database', {
        extensions: { code: 'DATABASE_ERROR', error: (error as Error).message },
      })
    }
  }
}
