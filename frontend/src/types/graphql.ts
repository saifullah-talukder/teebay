export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  address: string
  phone: string
}

type EmbeddedUser = Omit<User, 'email' | 'address' | 'phone'>

export type Product = {
  id: string
  title: string
  description: string
  price: number
  rentPrice: number | null
  categories: Category[]
  owner: EmbeddedUser
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
  buyer: EmbeddedUser
  seller: EmbeddedUser
  price: number
  createdAt: string
}

export type MyBoughtProductsData = {
  me: { boughtProducts: Transaction[] }
}

export type MySoldProductsData = {
  me: { soldProducts: Transaction[] }
}

export type Rental = {
  id: string
  product: Product
  renter: EmbeddedUser
  owner: EmbeddedUser
  startDate: string
  endDate: string
  price: number
  createdAt: string
}

export type MyBorrowedProductsData = {
  me: { rentedProducts: Rental[] }
}

export type MyLentProductsData = {
  me: { lentProducts: Rental[] }
}

export type RentalsByProductVars = {
  productId: string
}

export type RentalsByProductData = {
  rentalsByProduct: Rental[]
}

export type AuthPayload = {
  token: string
  user: User
}
