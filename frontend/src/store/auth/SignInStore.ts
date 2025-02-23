import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { SigninPayload, signinSchema } from '../../validation/SignIn'

type SignInStore = {
  state: SigninPayload
  isValidated: boolean
  errorMessage: string | null
  setSignInState: <T extends keyof SigninPayload>(key: T, value: SigninPayload[T]) => void
  reset: () => void
}

const initialState: SigninPayload = {
  email: '',
  password: '',
}

export const useSignInStore = create<SignInStore>()(
  devtools(
    set => ({
      state: initialState,
      isValidated: false,
      errorMessage: null,

      setSignInState: (key, value) =>
        set(store => {
          const newState = { ...store.state, [key]: value }
          const validation = signinSchema.safeParse(newState)
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
    { name: 'signin-store' }
  )
)
