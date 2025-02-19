import { prismaClient } from '../providers/PrismaClient'
import { Context } from '../types/Apollo'
import Resolver from './Resolver'

export class CategoryTypeResolver extends Resolver {
  async products(parent: { name: string }, _: any, context: Context) {
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

export class CategoryQueryResolver extends Resolver {
  async categories(_: any, __: any, context: Context) {
    return prismaClient.category.findMany()
  }

  register() {
    return {
      categories: this.categories.bind(this),
    }
  }
}
