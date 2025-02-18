import { Context } from '../types/Apollo'
import Resolver from './Resolver'

export class RentalResolver extends Resolver {
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
