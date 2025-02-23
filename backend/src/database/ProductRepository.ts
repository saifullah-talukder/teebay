import { GraphQLError } from 'graphql'
import { omit } from 'lodash'
import { CreateProductPayload } from '../validation/product/CreateProductMutation'
import Repository from './Repository'

export type UpdateProductBody = { id: string } & Partial<CreateProductPayload>

export class ProductRepository extends Repository {
  async findProducts() {
    try {
      return await this.prismaClient.product.findMany({
        include: {
          owner: true,
          categories: true,
          rentals: true,
          transactions: true,
        },
      })
    } catch (error) {
      throw new GraphQLError('Failed to fetch product', {
        extensions: { code: 'DATABASE_ERROR', error: (error as Error).message },
      })
    }
  }

  async findProductsById(productIds: string[]) {
    try {
      return await this.prismaClient.product.findMany({
        where: { id: { in: productIds } },
        include: {
          owner: true,
          categories: true,
          rentals: true,
          transactions: true,
        },
      })
    } catch (error) {
      throw new GraphQLError('Failed to fetch products', {
        extensions: { code: 'DATABASE_ERROR', error: (error as Error).message },
      })
    }
  }

  async findProductsByOwner(ownerIds: string[]) {
    try {
      return await this.prismaClient.product.findMany({
        where: { ownerId: { in: ownerIds } },
        include: {
          owner: true,
          categories: true,
          rentals: true,
          transactions: true,
        },
      })
    } catch (error) {
      throw new GraphQLError('Failed to fetch products by owner', {
        extensions: { code: 'DATABASE_ERROR', error: (error as Error).message },
      })
    }
  }

  async findProductsByCategory(categories: string[]) {
    try {
      return await this.prismaClient.product.findMany({
        where: {
          categories: {
            some: {
              name: { in: categories },
            },
          },
        },
        include: {
          owner: true,
          categories: true,
          rentals: true,
          transactions: true,
        },
      })
    } catch (error) {
      throw new GraphQLError('Failed to fetch products by category', {
        extensions: { code: 'DATABASE_ERROR', error: (error as Error).message },
      })
    }
  }

  async createProduct(userId: string, createProductPayload: CreateProductPayload) {
    try {
      const { title, description, price, rentPrice, isRentable, categories } = createProductPayload
      return await this.prismaClient.product.create({
        data: {
          title,
          description,
          price,
          rentPrice,
          isRentable,
          owner: {
            connect: { id: userId },
          },
          categories: {
            connect: categories.map(name => ({ name })),
          },
        },
        include: {
          owner: true,
          categories: true,
        },
      })
    } catch (error) {
      throw new GraphQLError('Failed to save product to database', {
        extensions: { code: 'DATABASE_ERROR', error: (error as Error).message },
      })
    }
  }

  async updateProduct(updateProductPayload: Omit<UpdateProductBody, 'categories'>) {
    try {
      return await this.prismaClient.product.update({
        where: { id: updateProductPayload.id },
        data: omit(updateProductPayload, 'id'),
        include: {
          owner: true,
          categories: true,
        },
      })
    } catch (error) {
      throw new GraphQLError('Failed to save updated product to database', {
        extensions: { code: 'DATABASE_ERROR', error: (error as Error).message },
      })
    }
  }

  async updateProductCategories(productId: string, categories: string[]) {
    try {
      return await this.prismaClient.product.update({
        where: { id: productId },
        data: {
          categories: {
            set: [],
            connect: categories.map(categoryName => ({
              name: categoryName,
            })),
          },
        },
        include: {
          categories: true,
        },
      })
    } catch (error) {
      throw new GraphQLError('Failed to save updated product to database', {
        extensions: { code: 'DATABASE_ERROR', error: (error as Error).message },
      })
    }
  }

  async deleteProduct(productId: string) {
    try {
      return await this.prismaClient.product.delete({ where: { id: productId } })
    } catch (error) {
      throw new GraphQLError('Failed to delete product from database', {
        extensions: { code: 'DATABASE_ERROR', error: (error as Error).message },
      })
    }
  }
}
