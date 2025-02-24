import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createProductSchema } from '../../validation/CreateProduct'

type CreateProductState = {
  title: string
  categories: string[]
  description: string
  price: number | null
  rentPrice: number | null
  isRentable: boolean
}

type CreateProductStore = {
  state: CreateProductState
  isValidated: boolean
  errorMessage: string | null
  setCreateProductState: <T extends keyof CreateProductState>(key: T, value: CreateProductState[T]) => void
  reset: () => void
}

const initialState: CreateProductState = {
  title: '',
  categories: [],
  description: '',
  price: 0,
  rentPrice: 0,
  isRentable: true,
}

export const useCreateProductStore = create<CreateProductStore>()(
  devtools(
    set => ({
      state: initialState,
      isValidated: false,
      errorMessage: null,

      setCreateProductState: (key, value) =>
        set(store => {
          const newState = { ...store.state, [key]: value }
          const validation = createProductSchema.safeParse(newState)
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
    { name: 'create-product-store' }
  )
)
