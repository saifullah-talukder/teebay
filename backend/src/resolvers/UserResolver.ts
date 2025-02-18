import { Context } from '../types/Apollo'
import Resolver from './Resolver'

export class UserTypeResolver extends Resolver {
  async products(parent: { id: string }, _: any, { prismaClient }: Context) {
    return prismaClient.product.findMany({
      where: { ownerId: parent.id },
    })
  }

  async boughtProducts(parent: { id: string }, _: any, { prismaClient }: Context) {
    return prismaClient.transaction.findMany({
      where: { buyerId: parent.id },
      include: {
        product: true,
        seller: true,
      },
    })
  }

  async soldProducts(parent: { id: string }, _: any, { prismaClient }: Context) {
    return prismaClient.transaction.findMany({
      where: { sellerId: parent.id },
      include: {
        product: true,
        buyer: true,
      },
    })
  }

  async rentedProducts(parent: { id: string }, _: any, { prismaClient }: Context) {
    return prismaClient.rental.findMany({
      where: { renterId: parent.id },
      include: {
        product: true,
        owner: true,
      },
    })
  }

  async lentProducts(parent: { id: string }, _: any, { prismaClient }: Context) {
    return prismaClient.rental.findMany({
      where: { ownerId: parent.id },
      include: {
        product: true,
        renter: true,
      },
    })
  }

  register() {
    return {
      products: this.products.bind(this),
      boughtProducts: this.boughtProducts.bind(this),
      soldProducts: this.soldProducts.bind(this),
      rentedProducts: this.rentedProducts.bind(this),
      lentProducts: this.lentProducts.bind(this),
    }
  }
}

export class UserQueryResolver extends Resolver {
  async users(_: any, __: any, { prismaClient }: Context) {
    return prismaClient.user.findMany()
  }

  async user(_: any, { id }: { id: string }, { prismaClient }: Context) {
    return prismaClient.user.findUnique({
      where: { id },
    })
  }

  register() {
    return {
      users: this.users.bind(this),
      user: this.user.bind(this),
    }
  }
}

export class UserMutationResolver extends Resolver {
  async users(_: any, __: any, { prismaClient }: Context) {
    return prismaClient.user.findMany()
  }

  async user(_: any, { id }: { id: string }, { prismaClient }: Context) {
    return prismaClient.user.findUnique({
      where: { id },
    })
  }

  register() {
    return {
      users: this.users.bind(this),
      user: this.user.bind(this),
    }
  }
}
