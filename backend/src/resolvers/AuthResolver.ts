import { LoginService } from '../services/auth/LoginService'
import { SignupService } from '../services/auth/SignupService'
import { Context } from '../types/Apollo'
import { LoginPayload, validateLoginPayload } from '../validation/auth/LoginMutation'
import { SignupPayload, validateSignupPayload } from '../validation/auth/SignupMutation'
import Resolver from './Resolver'

export class AuthResolver extends Resolver {
  async signup(_: any, payload: SignupPayload, context: Context) {
    const signupPayload = validateSignupPayload(payload)
    return await new SignupService(signupPayload).execute()
  }

  async login(_: any, payload: LoginPayload, context: Context) {
    const loginPayload = validateLoginPayload(payload)
    return await new LoginService(loginPayload).execute()
  }

  register() {
    return {
      signup: this.signup.bind(this),
      login: this.login.bind(this),
    }
  }
}
