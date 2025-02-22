export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  products: Product[]
  boughtProducts: Transaction[]
  soldProducts: Transaction[]
  rentedProducts: Rental[]
  lentProducts: Rental[]
}

export type Product = {
  id: string
  title: string
  description: string
  price: number
  rentPrice?: number
  categories: Category[]
  owner: User
  isAvailable: boolean
  isRentable: boolean
  createdAt: string
  updatedAt: string
}

export type Category = {
  name: string
  products: Product[]
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
