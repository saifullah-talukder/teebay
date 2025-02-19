import bcrypt from 'bcryptjs'
import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../../middleware/Auth'
import { DataLoaders } from '../../providers/DataLoaders'
import { LoginPayload } from '../../validation/auth/LoginMutation'
import { Service } from '../Service'

export class LoginService extends Service {
  constructor(private loginPayload: LoginPayload, private loaders: DataLoaders) {
    super()
  }

  async execute() {
    const user = await this.loaders.userLoader.loadUsersByEmail.load(this.loginPayload.email)

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
