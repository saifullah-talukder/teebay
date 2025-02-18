import bcrypt from 'bcryptjs'
import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'
import { Context } from '../types/Apollo'
import { JWT_SECRET } from '../utils/Auth'
import Resolver from './Resolver'

export class AuthResolver extends Resolver {
  async signup(
    _: any,
    {
      email,
      password,
      firstName,
      lastName,
    }: {
      email: string
      password: string
      firstName: string
      lastName: string
    },
    { prismaClient }: Context
  ) {
    // Check if user already exists
    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new GraphQLError('User with this email already exists', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const user = await prismaClient.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    })

    return user
  }

  async login(_: any, { email, password }: { email: string; password: string }, { prismaClient }: Context) {
    // Find user by email
    const user = await prismaClient.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new GraphQLError('Invalid email or password', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      throw new GraphQLError('Invalid email or password', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '1d',
    })

    return {
      token,
      user,
    }
  }

  register() {
    return {
      signup: this.signup.bind(this),
      login: this.login.bind(this),
    }
  }
}
