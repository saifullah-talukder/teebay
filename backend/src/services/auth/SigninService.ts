import bcrypt from 'bcryptjs'
import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../../middleware/Auth'
import { DataLoaders } from '../../providers/DataLoaders'
import { SigninPayload } from '../../validation/auth/SigninMutation'
import { Service } from '../Service'

export class SigninService extends Service {
  constructor(private signinPayload: SigninPayload, private loaders: DataLoaders) {
    super()
  }

  async execute() {
    const user = await this.loaders.userLoader.loadUsersByEmail.load(this.signinPayload.email)

    if (!user) {
      throw new GraphQLError('Invalid email or password', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    const validPassword = await bcrypt.compare(this.signinPayload.password, user.password)
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
