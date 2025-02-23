export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  address: string
  phone: string
}

export type Product = {
  id: string
  title: string
  description: string
  price: number
  rentPrice?: number | null
  categories: Category[]
  owner: Omit<User, 'email' | 'address' | 'phone'>
  isAvailable: boolean
  isRentable: boolean
  createdAt: string
  updatedAt: string
}

export type ProductsData = {
  products: Product[]
}

export type ProductData = {
  product: Product
}

export type MyProductsData = {
  me: ProductsData
}

export type MyBoughtProductsData = {
  me: { boughtProducts: Product[] }
}

export type MySoldProductsData = {
  me: { soldProducts: Product[] }
}

export type MyBorrowedProductsData = {
  me: { rentedProducts: Product[] }
}

export type MyLentProductsData = {
  me: { lentProducts: Product[] }
}

export type ProductVars = {
  id: string
}

export type Category = {
  name: string
}

export type CategoriesData = {
  categories: Category[]
}

export type Transaction = {
  id: string
  product: Product
  buyer: User
  seller: User
  price: number
  createdAt: string
}

export type Rental = {
  id: string
  product: Product
  renter: User
  owner: User
  startDate: string
  endDate: string
  price: number
  createdAt: string
}

export type AuthPayload = {
  token: string
  user: User
}
