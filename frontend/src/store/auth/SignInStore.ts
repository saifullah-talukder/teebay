import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type SignInState = {
  email: string
  password: string
}

type SignInStore = {
  state: SignInState
  setSignInState: <T extends keyof SignInState>(key: T, value: SignInState[T]) => void
  reset: () => void
}

const initialState: SignInState = {
  email: '',
  password: '',
}

export const useSignInStore = create<SignInStore>()(
  devtools(
    set => ({
      state: initialState,

      setSignInState: (key, value) =>
        set(store => {
          return { state: { ...store.state, [key]: value } }
        }),

      reset: () =>
        set(() => {
          return { state: initialState }
        }),
    }),
    { name: 'signin-store' }
  )
)
