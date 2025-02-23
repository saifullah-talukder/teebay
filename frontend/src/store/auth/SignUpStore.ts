import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { SignupPayload, signupSchema } from '../../validation/SignUp'

type SignUpStore = {
  state: SignupPayload
  isValidated: boolean
  errorMessage: string | null
  setSignUpState: <T extends keyof SignupPayload>(key: T, value: SignupPayload[T]) => void
  reset: () => void
}

const initialState: SignupPayload = {
  firstName: '',
  lastName: '',
  address: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

export const useSignUpStore = create<SignUpStore>()(
  devtools(
    set => ({
      state: initialState,
      isValidated: false,
      errorMessage: null,

      setSignUpState: (key, value) =>
        set(store => {
          const newState = { ...store.state, [key]: value }
          const validation = signupSchema.safeParse(newState)
          const newStore = {
            state: { ...store.state, [key]: value },
            isValidated: validation.success,
          }

          if (!validation.success) {
            const messages = []
            for (const [key, value] of Object.entries(validation.error.flatten().fieldErrors)) {
              messages.push(`${key} - ${value}`)
            }

            const message = messages.length ? messages.join('\n') : 'Validation Error'
            return { ...newStore, errorMessage: message }
          }

          return newStore
        }),

      reset: () =>
        set(() => {
          return { state: initialState }
        }),
    }),
    { name: 'signup-store' }
  )
)
