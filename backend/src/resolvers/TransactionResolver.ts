import { Context } from '../types/Apollo'
import Resolver from './Resolver'

export class TransactionResolver extends Resolver {
  async product(parent: { productId: string }, _: any, { prismaClient }: Context) {
    return prismaClient.product.findUnique({
      where: { id: parent.productId },
    })
  }

  async buyer(parent: { buyerId: string }, _: any, { prismaClient }: Context) {
    return prismaClient.user.findUnique({
      where: { id: parent.buyerId },
    })
  }

  async seller(parent: { sellerId: string }, _: any, { prismaClient }: Context) {
    return prismaClient.user.findUnique({
      where: { id: parent.sellerId },
    })
  }

  register() {
    return {
      product: this.product.bind(this),
      buyer: this.buyer.bind(this),
      seller: this.seller.bind(this),
    }
  }
}
