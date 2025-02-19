import { GraphQLError } from 'graphql'
import Repository from './Repository'
import { RentProductPayload } from '../validation/rental/RentProductMutation'

export type CreateRentalBody = {
  renterId: string
  ownerId: string
  totalPrice: number
  rentProductPayload: RentProductPayload
}

export class RentalRepository extends Repository {
  async findRentalsByProduct(productIds: string[]) {
    try {
      return await this.prismaClient.rental.findMany({
        where: { productId: { in: productIds } },
        include: {
          product: true,
          renter: true,
          owner: true,
        },
      })
    } catch (error) {
      throw new GraphQLError('Failed to fetch rentals by product', {
        extensions: { code: 'DATABASE_ERROR', error: (error as Error).message },
      })
    }
  }

  async findRentalsByOwner(ownerIds: string[]) {
    try {
      return await this.prismaClient.rental.findMany({
        where: { ownerId: { in: ownerIds } },
        include: {
          product: true,
          renter: true,
          owner: true,
        },
      })
    } catch (error) {
      throw new GraphQLError('Failed to fetch rentals by owner', {
        extensions: { code: 'DATABASE_ERROR', error: (error as Error).message },
      })
    }
  }

  async findRentalsByRenter(renterIds: string[]) {
    try {
      return await this.prismaClient.rental.findMany({
        where: { renterId: { in: renterIds } },
        include: {
          product: true,
          renter: true,
          owner: true,
        },
      })
    } catch (error) {
      throw new GraphQLError('Failed to fetch rentals by renter', {
        extensions: { code: 'DATABASE_ERROR', error: (error as Error).message },
      })
    }
  }

  async findOverlappingRentals(rentProductPayload: RentProductPayload) {
    try {
      const { productId, startDate, endDate } = rentProductPayload
      return await this.prismaClient.rental.findMany({
        where: {
          productId,
          OR: [
            {
              // New rental starts during an existing rental
              AND: [{ startDate: { lte: startDate } }, { endDate: { gte: startDate } }],
            },
            {
              // New rental ends during an existing rental
              AND: [{ startDate: { lte: endDate } }, { endDate: { gte: endDate } }],
            },
            {
              // New rental encompasses an existing rental
              AND: [{ startDate: { gte: startDate } }, { endDate: { lte: endDate } }],
            },
          ],
        },
      })
    } catch (error) {
      throw new GraphQLError('Failed to fetch overlapping rentals', {
        extensions: { code: 'DATABASE_ERROR', error: (error as Error).message },
      })
    }
  }

  async createRental(createRentalBody: CreateRentalBody) {
    try {
      return await this.prismaClient.rental.create({
        data: {
          product: {
            connect: { id: createRentalBody.rentProductPayload.productId },
          },
          renter: {
            connect: { id: createRentalBody.renterId },
          },
          owner: {
            connect: { id: createRentalBody.ownerId },
          },
          startDate: createRentalBody.rentProductPayload.startDate,
          endDate: createRentalBody.rentProductPayload.endDate,
          price: createRentalBody.totalPrice,
        },
        include: {
          product: true,
          renter: true,
          owner: true,
        },
      })
    } catch (error) {
      throw new GraphQLError('Failed to save rental to database', {
        extensions: { code: 'DATABASE_ERROR', error: (error as Error).message },
      })
    }
  }
}
