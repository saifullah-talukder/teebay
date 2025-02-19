import bcrypt from 'bcryptjs'
import { GraphQLError } from 'graphql'
import { UserRepository } from '../../database/UserRepository'
import { SignupPayload } from '../../validation/auth/SignupMutation'
import { Service } from '../Service'

export class SignupService extends Service {
  userRepository: UserRepository

  constructor(private signupPayload: SignupPayload) {
    super()
    this.userRepository = new UserRepository()
  }

  async execute() {
    const existingUser = await this.userRepository.findUserByEmail(this.signupPayload.email)

    if (existingUser) {
      throw new GraphQLError('User with this email already exists', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    const hashedPassword = await bcrypt.hash(this.signupPayload.password, 10)

    const user = await this.userRepository.createNewUser({ ...this.signupPayload, password: hashedPassword })

    return user
  }
}
