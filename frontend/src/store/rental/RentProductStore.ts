import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { RentProductPayload, rentProductSchema } from '../../validation/RentProduct'

type RentProductStore = {
  state: RentProductPayload
  isValidated: boolean
  errorMessage: string | null
  setRentProductState: <T extends keyof RentProductPayload>(key: T, value: RentProductPayload[T]) => void
  reset: () => void
}

const initialState: RentProductPayload = {
  startDate: '',
  endDate: '',
}

export const useRentProductStore = create<RentProductStore>()(
  devtools(
    set => ({
      state: initialState,
      isValidated: false,
      errorMessage: null,

      setRentProductState: (key, value) =>
        set(store => {
          const newState = { ...store.state, [key]: value }
          const validation = rentProductSchema.safeParse(newState)
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
    { name: 'rent-product-store' }
  )
)
