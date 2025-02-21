import { SigninService } from '../services/auth/SigninService'
import { SignupService } from '../services/auth/SignupService'
import { Context } from '../types/Apollo'
import { SigninPayload, validateSigninPayload } from '../validation/auth/SigninMutation'
import { SignupPayload, validateSignupPayload } from '../validation/auth/SignupMutation'
import Resolver from './Resolver'

export class AuthResolver extends Resolver {
  async signup(_: any, payload: SignupPayload, context: Context) {
    const signupPayload = validateSignupPayload(payload)
    return await new SignupService(signupPayload, context.loaders).execute()
  }

  async signin(_: any, payload: SigninPayload, context: Context) {
    const signinPayload = validateSigninPayload(payload)
    return await new SigninService(signinPayload, context.loaders).execute()
  }

  register() {
    return {
      signup: this.signup.bind(this),
      signin: this.signin.bind(this),
    }
  }
}
