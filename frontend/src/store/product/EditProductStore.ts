import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type EditProductState = {
  title: string
  categories: string[]
  description: string
  price: number | null
  rentPrice: number | null
}

type EditProductStore = {
  state: EditProductState
  setAllState: (state: EditProductState) => void
  setEditProductState: <T extends keyof EditProductState>(key: T, value: EditProductState[T]) => void
  reset: () => void
}

const initialState: EditProductState = {
  title: '',
  categories: [],
  description: '',
  price: null,
  rentPrice: null,
}

export const useEditProductStore = create<EditProductStore>()(
  devtools(
    set => ({
      state: initialState,

      setEditProductState: (key, value) =>
        set(store => {
          return { state: { ...store.state, [key]: value } }
        }),

      setAllState: newState =>
        set(() => {
          return { state: { ...newState } }
        }),

      reset: () =>
        set(() => {
          return { state: initialState }
        }),
    }),
    { name: 'edit-product-store' }
  )
)
