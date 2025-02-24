import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { editProductSchema } from '../../validation/EditProduct'

type EditProductState = {
  id: string
  title: string
  categories: string[]
  description: string
  price: number | null
  rentPrice: number | null
  isRentable: boolean
}

type EditProductStore = {
  state: EditProductState
  isValidated: boolean
  errorMessage: string | null
  setAllState: (state: EditProductState) => void
  setEditProductState: <T extends keyof EditProductState>(key: T, value: EditProductState[T]) => void
  reset: () => void
}

const initialState: EditProductState = {
  id: '',
  title: '',
  categories: [],
  description: '',
  price: 0,
  rentPrice: 0,
  isRentable: true,
}

export const useEditProductStore = create<EditProductStore>()(
  devtools(
    set => ({
      state: null,
      isValidated: false,
      errorMessage: null,

      setEditProductState: (key, value) =>
        set(store => {
          const newState = { ...store.state, [key]: value }
          const validation = editProductSchema.safeParse(newState)
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

      setAllState: newState =>
        set(() => {
          const validation = editProductSchema.safeParse(newState)
          const newStore = {
            state: { ...newState },
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
    { name: 'edit-product-store' }
  )
)
