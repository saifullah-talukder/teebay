import { GraphQLError } from 'graphql'
import { Context } from '../types/Apollo'
import { getUserId } from '../utils/Auth'
import Resolver from './Resolver'

export class ProductTypeResolver extends Resolver {
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

export class ProductQueryResolver extends Resolver {
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

  register() {
    return {
      products: this.products.bind(this),
      product: this.product.bind(this),
      myProducts: this.myProducts.bind(this),
    }
  }
}

export class ProductMutationResolver extends Resolver {
  async createProduct(
    _: any,
    {
      title,
      description,
      price,
      rentPrice,
      isRentable,
      categories,
    }: {
      title: string
      description: string
      price: number
      rentPrice: number
      isRentable: boolean
      categories: string[]
    },
    { prismaClient, req }: Context
  ) {
    const userId = getUserId({ prismaClient, req })

    // Create the product
    const product = await prismaClient.product.create({
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

    return product
  }

  async updateProduct(
    _: any,
    {
      id,
      title,
      description,
      price,
      rentPrice,
      isRentable,
      categoryIds,
    }: {
      id: string
      title?: string
      description?: string
      price?: number
      rentPrice?: number
      isRentable?: boolean
      categoryIds?: string[]
    },
    { prismaClient, req }: Context
  ) {
    const userId = getUserId({ prismaClient, req })

    // Verify product ownership
    const existingProduct = await prismaClient.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      throw new GraphQLError('Product not found', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    if (existingProduct.ownerId !== userId) {
      throw new GraphQLError('Not authorized to update this product', {
        extensions: { code: 'FORBIDDEN' },
      })
    }

    // Prepare update data
    const updateData: any = {
      title,
      description,
      price,
      rentPrice,
      isRentable,
    }

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    // Update categories if provided
    if (categoryIds) {
      // First disconnect all existing categories
      await prismaClient.product.update({
        where: { id },
        data: {
          categories: {
            set: [],
          },
        },
      })

      // Then connect new categories
      updateData.categories = {
        connect: categoryIds.map(catId => ({ id: parseInt(catId) })),
      }
    }

    // Update the product
    const updatedProduct = await prismaClient.product.update({
      where: { id },
      data: updateData,
      include: {
        owner: true,
        categories: true,
      },
    })

    return updatedProduct
  }

  async deleteProduct(_: any, { id }: { id: string }, { prismaClient, req }: Context) {
    const userId = getUserId({ prismaClient, req })

    // Verify product ownership
    const existingProduct = await prismaClient.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      throw new GraphQLError('Product not found', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    if (existingProduct.ownerId !== userId) {
      throw new GraphQLError('Not authorized to delete this product', {
        extensions: { code: 'FORBIDDEN' },
      })
    }

    // Check if product is involved in any transactions or rentals
    const transactions = await prismaClient.transaction.findMany({
      where: { productId: id },
    })

    const rentals = await prismaClient.rental.findMany({
      where: { productId: id },
    })

    if (transactions.length > 0 || rentals.length > 0) {
      throw new GraphQLError('Cannot delete product that has transactions or rentals', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    // Delete the product
    await prismaClient.product.delete({
      where: { id },
    })

    return true
  }

  register() {
    return {
      createProduct: this.createProduct.bind(this),
      updateProduct: this.updateProduct.bind(this),
      deleteProduct: this.deleteProduct.bind(this),
    }
  }
}
