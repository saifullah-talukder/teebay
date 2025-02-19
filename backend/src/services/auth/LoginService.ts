import bcrypt from 'bcryptjs'
import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'
import { UserRepository } from '../../database/UserRepository'
import { JWT_SECRET } from '../../middleware/Auth'
import { LoginPayload } from '../../validation/auth/LoginMutation'
import { Service } from '../Service'

export class LoginService extends Service {
  userRepository: UserRepository

  constructor(private loginPayload: LoginPayload) {
    super()
    this.userRepository = new UserRepository()
  }

  async execute() {
    const user = await this.userRepository.findUserByEmail(this.loginPayload.email)

    if (!user) {
      throw new GraphQLError('Invalid email or password', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    const validPassword = await bcrypt.compare(this.loginPayload.password, user.password)
    if (!validPassword) {
      throw new GraphQLError('Invalid email or password', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '1d',
    })

    return { token, user }
  }
}
