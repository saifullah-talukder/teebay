import { GraphQLError } from 'graphql'
import Repository from './Repository'

export class CategoryRepository extends Repository {
  async findCategories() {
    try {
      return await this.prismaClient.category.findMany()
    } catch (error) {
      throw new GraphQLError('Failed to fetch categories', {
        extensions: { code: 'DATABASE_ERROR', error: (error as Error).message },
      })
    }
  }

  async findCategoriesByProducts(productIds: string[]) {
    try {
      return await this.prismaClient.category.findMany({
        where: {
          products: {
            some: {
              id: { in: productIds as string[] },
            },
          },
        },
        include: {
          products: {
            select: { id: true },
          },
        },
      })
    } catch (error) {
      throw new GraphQLError('Failed to fetch categories of products', {
        extensions: { code: 'DATABASE_ERROR', error: (error as Error).message },
      })
    }
  }
}
