import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type CreateProductState = {
  title: string
  categories: string[]
  description: string
  price: number | null
  rentPrice: number | null
}

type CreateProductStore = {
  state: CreateProductState
  setCreateProductState: <T extends keyof CreateProductState>(key: T, value: CreateProductState[T]) => void
  reset: () => void
}

const initialState: CreateProductState = {
  title: '',
  categories: [],
  description: '',
  price: null,
  rentPrice: null,
}

export const useCreateProductStore = create<CreateProductStore>()(
  devtools(
    set => ({
      state: initialState,

      setCreateProductState: (key, value) =>
        set(store => {
          return { state: { ...store.state, [key]: value } }
        }),

      reset: () =>
        set(() => {
          return { state: initialState }
        }),
    }),
    { name: 'create-product-store' }
  )
)
