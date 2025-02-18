import { Context } from '../types/Apollo'
import Resolver from './Resolver'

export class ProductResolver extends Resolver {
  async owner(parent: { ownerId: string }, _: any, { prismaClient }: Context) {
    return prismaClient.user.findUnique({
      where: { id: parent.ownerId },
    })
  }

  async categories(parent: { id: string }, _: any, { prismaClient }: Context) {
    return prismaClient.category.findMany({
      where: {
        products: {
          some: {
            id: parent.id,
          },
        },
      },
    })
  }

  register() {
    return {
      owner: this.owner.bind(this),
      categories: this.categories.bind(this),
    }
  }
}
