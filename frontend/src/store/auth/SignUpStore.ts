import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type SignUpState = {
  firstName: string
  lastName: string
  address: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

type SignUpStore = {
  state: SignUpState
  setSignUpState: <T extends keyof SignUpState>(key: T, value: SignUpState[T]) => void
  reset: () => void
}

const initialState: SignUpState = {
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

      setSignUpState: (key, value) =>
        set(store => {
          return { state: { ...store.state, [key]: value } }
        }),

      reset: () =>
        set(() => {
          return { state: initialState }
        }),
    }),
    { name: 'signup-store' }
  )
)
