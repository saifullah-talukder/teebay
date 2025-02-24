import { GraphQLError } from 'graphql'
import { DataLoaders } from '../../providers/DataLoaders'
import { RentProductPayload } from '../../validation/rental/RentProductMutation'
import { Service } from '../Service'
import { calculateDaysBetween } from '../../utils/DateTime'
import { RentalRepository } from '../../database/RentalRepository'

export class RentProductService extends Service {
  rentalRepository: RentalRepository

  constructor(private renterId: string, private rentProductPayload: RentProductPayload, private loaders: DataLoaders) {
    super()
    this.rentalRepository = new RentalRepository()
  }

  async execute() {
    const { productId, startDate, endDate } = this.rentProductPayload

    const start = new Date(startDate)
    const end = new Date(endDate)
    const today = new Date()

    today.setHours(0, 0, 0, 0)
    start.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)

    if (start.getTime() <= today.getTime()) {
      throw new GraphQLError('Start date has to be in the future', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    if (end.getTime() < start.getTime()) {
      throw new GraphQLError('End date must be equal or after start date', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    const product = await this.loaders.productLoader.loadProductsById.load(productId)

    if (!product) {
      throw new GraphQLError('Product not found', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    if (!product.isRentable || !product.isAvailable) {
      throw new GraphQLError('Product is not available for rent', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    if (product.ownerId === this.renterId) {
      throw new GraphQLError('Cannot rent your own product', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    const overlappingRentals = await this.rentalRepository.findOverlappingRentals(this.rentProductPayload)

    if (overlappingRentals.length > 0) {
      throw new GraphQLError('Product is already rented for the selected period', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    const durationInDays = calculateDaysBetween(startDate, endDate)
    const totalPrice = (product.rentPrice ?? 0) * durationInDays

    return await this.rentalRepository.createRental({
      renterId: this.renterId,
      ownerId: product.ownerId,
      totalPrice,
      rentProductPayload: this.rentProductPayload,
    })
  }
}
