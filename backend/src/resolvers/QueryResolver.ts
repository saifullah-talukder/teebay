import { Context } from '../types/Apollo'
import { getUserId } from '../utils/Auth'
import Resolver from './Resolver'

export class QueryResolver extends Resolver {
  async users(_: any, __: any, { prismaClient }: Context) {
    return prismaClient.user.findMany()
  }

  async user(_: any, { id }: { id: string }, { prismaClient }: Context) {
    return prismaClient.user.findUnique({
      where: { id },
    })
  }

  async products(_: any, __: any, { prismaClient }: Context) {
    return prismaClient.product.findMany({
      include: {
        owner: true,
        categories: true,
      },
    })
  }

  async product(_: any, { id }: { id: string }, { prismaClient }: Context) {
    return prismaClient.product.findUnique({
      where: { id },
      include: {
        owner: true,
        categories: true,
      },
    })
  }

  async categories(_: any, __: any, { prismaClient }: Context) {
    return prismaClient.category.findMany()
  }

  async myProducts(_: any, __: any, { prismaClient, req }: Context) {
    const userId = getUserId({ prismaClient, req })
    return prismaClient.product.findMany({
      where: { ownerId: userId },
      include: {
        owner: true,
        categories: true,
      },
    })
  }

  async myTransactions(_: any, __: any, { prismaClient, req }: Context) {
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
  }

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
      users: this.users.bind(this),
      user: this.user.bind(this),
      products: this.products.bind(this),
      product: this.product.bind(this),
      categories: this.categories.bind(this),
      myProducts: this.myProducts.bind(this),
      myTransactions: this.myTransactions.bind(this),
      myRentals: this.myRentals.bind(this),
    }
  }
}
