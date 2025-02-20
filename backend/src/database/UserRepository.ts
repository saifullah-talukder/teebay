import { GraphQLError } from 'graphql'
import Repository from './Repository'
import { SignupPayload } from '../validation/auth/SignupMutation'

export class UserRepository extends Repository {
  async findUsers() {
    try {
      return await this.prismaClient.user.findMany()
    } catch (error) {
      throw new GraphQLError('Failed to fetch users', {
        extensions: { code: 'DATABASE_ERROR', error: (error as Error).message },
      })
    }
  }

  async findUsersByIds(userIds: string[]) {
    try {
      return await this.prismaClient.user.findMany({
        where: { id: { in: userIds } },
      })
    } catch (error) {
      throw new GraphQLError('Failed to fetch users by ids', {
        extensions: { code: 'DATABASE_ERROR', error: (error as Error).message },
      })
    }
  }

  async findUsersByEmails(emails: string[]) {
    try {
      return await this.prismaClient.user.findMany({
        where: { email: { in: emails } },
      })
    } catch (error) {
      throw new GraphQLError('Failed to fetch users by emails', {
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
