import { GraphQLError } from 'graphql'
import { Context } from '../types/Apollo'
import { getUserId } from '../utils/Auth'
import Resolver from './Resolver'

export class RentalTypeResolver extends Resolver {
  async product(parent: { productId: string }, _: any, { prismaClient }: Context) {
    return prismaClient.product.findUnique({
      where: { id: parent.productId },
    })
  }

  async renter(parent: { renterId: string }, _: any, { prismaClient }: Context) {
    return prismaClient.user.findUnique({
      where: { id: parent.renterId },
    })
  }

  async owner(parent: { ownerId: string }, _: any, { prismaClient }: Context) {
    return prismaClient.user.findUnique({
      where: { id: parent.ownerId },
    })
  }

  register() {
    return {
      product: this.product.bind(this),
      renter: this.renter.bind(this),
      owner: this.owner.bind(this),
    }
  }
}

export class RentalQueryResolver extends Resolver {
  async myRentals(_: any, __: any, { prismaClient, req }: Context) {
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
  }

  register() {
    return {
      myRentals: this.myRentals.bind(this),
    }
  }
}

export class RentalMutationResolver extends Resolver {
  async rentProduct(
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
  ) {
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
  }

  register() {
    return {
      rentProduct: this.rentProduct.bind(this),
    }
  }
}
