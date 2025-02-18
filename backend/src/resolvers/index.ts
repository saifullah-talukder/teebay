import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { Context } from '../types/Apollo'

interface TokenPayload {
  userId: string
}

const JWT_SECRET = process.env.JWT_SECRET!

const getUserId = (context: Context): string => {
  const Authorization = context.req.headers.authorization
  if (!Authorization) {
    throw new GraphQLError('Not authenticated', {
      extensions: { code: 'UNAUTHENTICATED' },
    })
  }

  const token = Authorization.replace('Bearer ', '')
  try {
    const { userId } = jwt.verify(token, JWT_SECRET) as TokenPayload
    return String(userId)
  } catch (error) {
    throw new GraphQLError('Invalid token', {
      extensions: { code: 'UNAUTHENTICATED' },
    })
  }
}

export const resolvers = {
  Query: {
    // Get all users
    users: async (_: any, __: any, { prismaClient }: Context) => {
      return prismaClient.user.findMany()
    },

    // Get a specific user by ID
    user: async (_: any, { id }: { id: string }, { prismaClient }: Context) => {
      return prismaClient.user.findUnique({
        where: { id },
      })
    },

    // Get all products
    products: async (_: any, __: any, { prismaClient }: Context) => {
      return prismaClient.product.findMany({
        include: {
          owner: true,
          categories: true,
        },
      })
    },

    // Get a specific product by ID
    product: async (_: any, { id }: { id: string }, { prismaClient }: Context) => {
      return prismaClient.product.findUnique({
        where: { id },
        include: {
          owner: true,
          categories: true,
        },
      })
    },

    // Get all categories
    categories: async (_: any, __: any, { prismaClient }: Context) => {
      return prismaClient.category.findMany()
    },

    // Get products owned by the authenticated user
    myProducts: async (_: any, __: any, { prismaClient, req }: Context) => {
      const userId = getUserId({ prismaClient, req })
      return prismaClient.product.findMany({
        where: { ownerId: userId },
        include: {
          owner: true,
          categories: true,
        },
      })
    },

    // Get all transactions for the authenticated user (both bought and sold)
    myTransactions: async (_: any, __: any, { prismaClient, req }: Context) => {
      const userId = getUserId({ prismaClient, req })
      return prismaClient.transaction.findMany({
        where: {
          OR: [{ buyerId: userId }, { sellerId: userId }],
        },
        include: {
          product: true,
          buyer: true,
          seller: true,
        },
      })
    },

    // Get all rentals for the authenticated user (both rented and lent)
    myRentals: async (_: any, __: any, { prismaClient, req }: Context) => {
      const userId = getUserId({ prismaClient, req })
      return prismaClient.rental.findMany({
        where: {
          OR: [{ renterId: userId }, { ownerId: userId }],
        },
        include: {
          product: true,
          renter: true,
          owner: true,
        },
      })
    },
  },

  Mutation: {
    // User registration
    register: async (
      _: any,
      {
        email,
        password,
        firstName,
        lastName,
      }: {
        email: string
        password: string
        firstName: string
        lastName: string
      },
      { prismaClient }: Context
    ) => {
      // Check if user already exists
      const existingUser = await prismaClient.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        throw new GraphQLError('User with this email already exists', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create new user
      const user = await prismaClient.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
        },
      })

      return user
    },

    // User login
    login: async (_: any, { email, password }: { email: string; password: string }, { prismaClient }: Context) => {
      // Find user by email
      const user = await prismaClient.user.findUnique({
        where: { email },
      })

      if (!user) {
        throw new GraphQLError('Invalid email or password', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password)
      if (!validPassword) {
        throw new GraphQLError('Invalid email or password', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: '1d',
      })

      return {
        token,
        user,
      }
    },

    // Create a new product
    createProduct: async (
      _: any,
      {
        title,
        description,
        price,
        rentPrice,
        isRentable,
        categories,
      }: {
        title: string
        description: string
        price: number
        rentPrice: number
        isRentable: boolean
        categories: string[]
      },
      { prismaClient, req }: Context
    ) => {
      const userId = getUserId({ prismaClient, req })

      // Create the product
      const product = await prismaClient.product.create({
        data: {
          title,
          description,
          price,
          rentPrice,
          isRentable,
          owner: {
            connect: { id: userId },
          },
          categories: {
            connect: categories.map(name => ({ name })),
          },
        },
        include: {
          owner: true,
          categories: true,
        },
      })

      return product
    },

    // Update an existing product
    updateProduct: async (
      _: any,
      {
        id,
        title,
        description,
        price,
        rentPrice,
        isRentable,
        categoryIds,
      }: {
        id: string
        title?: string
        description?: string
        price?: number
        rentPrice?: number
        isRentable?: boolean
        categoryIds?: string[]
      },
      { prismaClient, req }: Context
    ) => {
      const userId = getUserId({ prismaClient, req })

      // Verify product ownership
      const existingProduct = await prismaClient.product.findUnique({
        where: { id },
      })

      if (!existingProduct) {
        throw new GraphQLError('Product not found', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      if (existingProduct.ownerId !== userId) {
        throw new GraphQLError('Not authorized to update this product', {
          extensions: { code: 'FORBIDDEN' },
        })
      }

      // Prepare update data
      const updateData: any = {
        title,
        description,
        price,
        rentPrice,
        isRentable,
      }

      // Remove undefined fields
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key]
        }
      })

      // Update categories if provided
      if (categoryIds) {
        // First disconnect all existing categories
        await prismaClient.product.update({
          where: { id },
          data: {
            categories: {
              set: [],
            },
          },
        })

        // Then connect new categories
        updateData.categories = {
          connect: categoryIds.map(catId => ({ id: parseInt(catId) })),
        }
      }

      // Update the product
      const updatedProduct = await prismaClient.product.update({
        where: { id },
        data: updateData,
        include: {
          owner: true,
          categories: true,
        },
      })

      return updatedProduct
    },

    // Delete a product
    deleteProduct: async (_: any, { id }: { id: string }, { prismaClient, req }: Context) => {
      const userId = getUserId({ prismaClient, req })

      // Verify product ownership
      const existingProduct = await prismaClient.product.findUnique({
        where: { id },
      })

      if (!existingProduct) {
        throw new GraphQLError('Product not found', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      if (existingProduct.ownerId !== userId) {
        throw new GraphQLError('Not authorized to delete this product', {
          extensions: { code: 'FORBIDDEN' },
        })
      }

      // Check if product is involved in any transactions or rentals
      const transactions = await prismaClient.transaction.findMany({
        where: { productId: id },
      })

      const rentals = await prismaClient.rental.findMany({
        where: { productId: id },
      })

      if (transactions.length > 0 || rentals.length > 0) {
        throw new GraphQLError('Cannot delete product that has transactions or rentals', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      // Delete the product
      await prismaClient.product.delete({
        where: { id },
      })

      return true
    },

    // Buy a product
    buyProduct: async (_: any, { productId }: { productId: string }, { prismaClient, req }: Context) => {
      const buyerId = getUserId({ prismaClient, req })

      // Get the product
      const product = await prismaClient.product.findUnique({
        where: { id: productId },
      })

      if (!product) {
        throw new GraphQLError('Product not found', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      // Check if product is available
      if (!product.isAvailable) {
        throw new GraphQLError('Product is not available for purchase', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      // Check if user is trying to buy their own product
      if (product.ownerId === buyerId) {
        throw new GraphQLError('Cannot buy your own product', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      // Start a transaction
      const transaction = await prismaClient.$transaction(async prismaClientClient => {
        // Create the transaction record
        const newTransaction = await prismaClientClient.transaction.create({
          data: {
            product: {
              connect: { id: productId },
            },
            buyer: {
              connect: { id: buyerId },
            },
            seller: {
              connect: { id: product.ownerId },
            },
            price: product.price,
          },
          include: {
            product: true,
            buyer: true,
            seller: true,
          },
        })

        // Update product availability
        await prismaClientClient.product.update({
          where: { id: productId },
          data: { isAvailable: false },
        })

        return newTransaction
      })

      return transaction
    },

    // Rent a product
    rentProduct: async (
      _: any,
      {
        productId,
        startDate,
        endDate,
      }: {
        productId: string
        startDate: string
        endDate: string
      },
      { prismaClient, req }: Context
    ) => {
      const renterId = getUserId({ prismaClient, req })

      // Parse dates
      const parsedStartDate = new Date(startDate)
      const parsedEndDate = new Date(endDate)

      // Validate dates
      if (parsedStartDate >= parsedEndDate) {
        throw new GraphQLError('End date must be after start date', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      if (parsedStartDate < new Date()) {
        throw new GraphQLError('Start date cannot be in the past', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      // Get the product
      const product = await prismaClient.product.findUnique({
        where: { id: productId },
      })

      if (!product) {
        throw new GraphQLError('Product not found', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      // Check if product is available for rent
      if (!product.isRentable || !product.isAvailable) {
        throw new GraphQLError('Product is not available for rent', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      // Check if user is trying to rent their own product
      if (product.ownerId === renterId) {
        throw new GraphQLError('Cannot rent your own product', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      // Check for overlapping rentals
      const overlappingRentals = await prismaClient.rental.findMany({
        where: {
          productId,
          OR: [
            {
              // New rental starts during an existing rental
              AND: [{ startDate: { lte: parsedStartDate } }, { endDate: { gte: parsedStartDate } }],
            },
            {
              // New rental ends during an existing rental
              AND: [{ startDate: { lte: parsedEndDate } }, { endDate: { gte: parsedEndDate } }],
            },
            {
              // New rental encompasses an existing rental
              AND: [{ startDate: { gte: parsedStartDate } }, { endDate: { lte: parsedEndDate } }],
            },
          ],
        },
      })

      if (overlappingRentals.length > 0) {
        throw new GraphQLError('Product is already rented for the selected period', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      // Calculate rental duration in days
      const durationInMs = parsedEndDate.getTime() - parsedStartDate.getTime()
      const durationInDays = Math.ceil(durationInMs / (1000 * 60 * 60 * 24))

      // Calculate total price
      const totalPrice = (product.rentPrice ?? 0) * durationInDays

      // Create the rental
      const rental = await prismaClient.rental.create({
        data: {
          product: {
            connect: { id: productId },
          },
          renter: {
            connect: { id: renterId },
          },
          owner: {
            connect: { id: product.ownerId },
          },
          startDate: parsedStartDate,
          endDate: parsedEndDate,
          price: totalPrice,
        },
        include: {
          product: true,
          renter: true,
          owner: true,
        },
      })

      return rental
    },
  },

  // Type resolvers
  User: {
    products: async (parent: { id: string }, _: any, { prismaClient }: Context) => {
      return prismaClient.product.findMany({
        where: { ownerId: parent.id },
      })
    },
    boughtProducts: async (parent: { id: string }, _: any, { prismaClient }: Context) => {
      return prismaClient.transaction.findMany({
        where: { buyerId: parent.id },
        include: {
          product: true,
          seller: true,
        },
      })
    },
    soldProducts: async (parent: { id: string }, _: any, { prismaClient }: Context) => {
      return prismaClient.transaction.findMany({
        where: { sellerId: parent.id },
        include: {
          product: true,
          buyer: true,
        },
      })
    },
    rentedProducts: async (parent: { id: string }, _: any, { prismaClient }: Context) => {
      return prismaClient.rental.findMany({
        where: { renterId: parent.id },
        include: {
          product: true,
          owner: true,
        },
      })
    },
    lentProducts: async (parent: { id: string }, _: any, { prismaClient }: Context) => {
      return prismaClient.rental.findMany({
        where: { ownerId: parent.id },
        include: {
          product: true,
          renter: true,
        },
      })
    },
  },

  Product: {
    owner: async (parent: { ownerId: string }, _: any, { prismaClient }: Context) => {
      return prismaClient.user.findUnique({
        where: { id: parent.ownerId },
      })
    },
    categories: async (parent: { id: string }, _: any, { prismaClient }: Context) => {
      return prismaClient.category.findMany({
        where: {
          products: {
            some: {
              id: parent.id,
            },
          },
        },
      })
    },
  },

  Category: {
    products: async (parent: { name: string }, _: any, { prismaClient }: Context) => {
      return prismaClient.product.findMany({
        where: {
          categories: {
            some: {
              name: parent.name,
            },
          },
        },
      })
    },
  },

  Transaction: {
    product: async (parent: { productId: string }, _: any, { prismaClient }: Context) => {
      return prismaClient.product.findUnique({
        where: { id: parent.productId },
      })
    },
    buyer: async (parent: { buyerId: string }, _: any, { prismaClient }: Context) => {
      return prismaClient.user.findUnique({
        where: { id: parent.buyerId },
      })
    },
    seller: async (parent: { sellerId: string }, _: any, { prismaClient }: Context) => {
      return prismaClient.user.findUnique({
        where: { id: parent.sellerId },
      })
    },
  },

  Rental: {
    product: async (parent: { productId: string }, _: any, { prismaClient }: Context) => {
      return prismaClient.product.findUnique({
        where: { id: parent.productId },
      })
    },
    renter: async (parent: { renterId: string }, _: any, { prismaClient }: Context) => {
      return prismaClient.user.findUnique({
        where: { id: parent.renterId },
      })
    },
    owner: async (parent: { ownerId: string }, _: any, { prismaClient }: Context) => {
      return prismaClient.user.findUnique({
        where: { id: parent.ownerId },
      })
    },
  },
}
