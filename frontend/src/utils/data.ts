import { AuthPayload, Category, Product, Rental, Transaction, User } from '../types/graphql'

const categories: Category[] = [
  {
    name: 'Electronics',
    products: [],
  },
  {
    name: 'Furniture',
    products: [],
  },
]

const users: User[] = [
  {
    id: 'usr_01',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    products: [],
    boughtProducts: [],
    soldProducts: [],
    rentedProducts: [],
    lentProducts: [],
  },
  {
    id: 'usr_02',
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    products: [],
    boughtProducts: [],
    soldProducts: [],
    rentedProducts: [],
    lentProducts: [],
  },
]

const products: Product[] = [
  {
    id: 'prod_01',
    title: 'MacBook Pro 2023',
    description:
      'Experience unparalleled performance with the latest MacBook Pro featuring the M2 chip. This powerful laptop comes with a stunning 14-inch Liquid Retina XDR display, 16GB unified memory, and 512GB SSD storage. Perfect for professionals and creatives, it offers up to 18 hours of battery life, a backlit Magic Keyboard with Touch ID, and a versatile array of ports including HDMI and SD card reader. The device is in excellent condition with minimal wear, includes the original charger, and comes with macOS Sonoma pre-installed.',
    price: 1299.99,
    rentPrice: 49.99,
    categories: [categories[0]],
    owner: users[0],
    isAvailable: true,
    isRentable: true,
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-02-20T10:00:00Z',
  },
  {
    id: 'prod_02',
    title: 'Modern Sofa',
    description:
      "Elevate your living space with this contemporary 3-seater sofa in a sophisticated charcoal gray. Upholstered in premium stain-resistant fabric, this piece combines style with practicality. The ergonomic design features high-density foam cushions with pocket springs for optimal comfort and longevity. The solid wood frame and metal legs ensure stability and durability. Measuring 84 inches wide, 36 inches deep, and 32 inches high, it's perfect for both compact apartments and spacious living rooms. Easy to clean and maintain, with removable cushion covers and includes two matching decorative pillows. Assembly service available upon request.",
    price: 799.99,
    rentPrice: 29.99,
    categories: [categories[1]],
    owner: users[1],
    isAvailable: true,
    isRentable: true,
    createdAt: '2024-02-19T15:30:00Z',
    updatedAt: '2024-02-19T15:30:00Z',
  },
]

categories[0].products = [products[0]]
categories[1].products = [products[1]]

const transactions: Transaction[] = [
  {
    id: 'tx_01',
    product: products[0],
    buyer: users[1],
    seller: users[0],
    price: 1299.99,
    createdAt: '2024-02-21T14:20:00Z',
  },
]

const rentals: Rental[] = [
  {
    id: 'rent_01',
    product: products[1],
    renter: users[0],
    owner: users[1],
    startDate: '2024-02-22T00:00:00Z',
    endDate: '2024-02-29T00:00:00Z',
    price: 209.93, // 7 days at 29.99 per day
    createdAt: '2024-02-21T16:45:00Z',
  },
]

users[0].products = [products[0]]
users[1].products = [products[1]]
users[0].soldProducts = [transactions[0]]
users[1].boughtProducts = [transactions[0]]
users[0].rentedProducts = [rentals[0]]
users[1].lentProducts = [rentals[0]]

const authPayload: AuthPayload = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3JfMDEiLCJpYXQiOjE2NDU1MzY2MDB9',
  user: users[0],
}

export const mockData = {
  categories,
  users,
  products,
  transactions,
  rentals,
  authPayload,
}
