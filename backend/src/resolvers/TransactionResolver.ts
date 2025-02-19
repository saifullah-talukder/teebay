import { GraphQLError } from 'graphql'
import { prismaClient } from '../providers/PrismaClient'
import { Context } from '../types/Apollo'
import { getUserId } from '../utils/Auth'
import Resolver from './Resolver'

export class TransactionTypeResolver extends Resolver {
  async product(parent: { productId: string }, _: any, context: Context) {
    return prismaClient.product.findUnique({
      where: { id: parent.productId },
    })
  }

  async buyer(parent: { buyerId: string }, _: any, context: Context) {
    return prismaClient.user.findUnique({
      where: { id: parent.buyerId },
    })
  }

  async seller(parent: { sellerId: string }, _: any, context: Context) {
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

export class TransactionQueryResolver extends Resolver {
  async myTransactions(_: any, __: any, context: Context) {
    const userId = getUserId(context)
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

  register() {
    return {
      myTransactions: this.myTransactions.bind(this),
    }
  }
}

export class TransactionMutationResolver extends Resolver {
  async buyProduct(_: any, { productId }: { productId: string }, context: Context) {
    const buyerId = getUserId(context)

    // Get the product
    const product = await prismaClient.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      throw new GraphQLError('Product not found', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    // Check if product is available
    if (!product.isAvailable) {
      throw new GraphQLError('Product is not available for purchase', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    // Check if user is trying to buy their own product
    if (product.ownerId === buyerId) {
      throw new GraphQLError('Cannot buy your own product', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    // Start a transaction
    const transaction = await prismaClient.$transaction(async prisma => {
      // Create the transaction record
      const newTransaction = await prisma.transaction.create({
        data: {
          product: {
            connect: { id: productId },
          },
          buyer: {
            connect: { id: buyerId },
          },
          seller: {
            connect: { id: product.ownerId },
          },
          price: product.price,
        },
        include: {
          product: true,
          buyer: true,
          seller: true,
        },
      })

      // Update product availability
      await prisma.product.update({
        where: { id: productId },
        data: { isAvailable: false },
      })

      return newTransaction
    })

    return transaction
  }

  register() {
    return {
      buyProduct: this.buyProduct.bind(this),
    }
  }
}
