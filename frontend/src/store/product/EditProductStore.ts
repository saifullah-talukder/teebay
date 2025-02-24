import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { EditProductPayload, editProductSchema } from '../../validation/EditProduct'

type EditProductStore = {
  state: EditProductPayload
  isValidated: boolean
  errorMessage: string | null
  setAllState: (state: EditProductPayload) => void
  setEditProductState: <T extends keyof EditProductPayload>(key: T, value: EditProductPayload[T]) => void
  reset: () => void
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
    }),
    { name: 'edit-product-store' }
  )
)
