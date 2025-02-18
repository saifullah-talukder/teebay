import { Context } from '../types/Apollo'
import Resolver from './Resolver'

export class CategoryResolver extends Resolver {
  async products(parent: { name: string }, _: any, { prismaClient }: Context) {
    return prismaClient.product.findMany({
      where: {
        categories: {
          some: {
            name: parent.name,
          },
        },
      },
    })
  }

  register() {
    return {
      products: this.products.bind(this),
    }
  }
}
