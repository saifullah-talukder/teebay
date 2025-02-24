import { PrismaClient } from '@prisma/client'
import { GraphQLError } from 'graphql'
import Repository from './Repository'

export type CreateTransactionBody = {
  buyerId: string
  sellerId: string
  productId: string
  price: number
}

export class TransactionRepository extends Repository {
  async findTransactionsByProduct(productIds: string[]) {
    try {
      return await this.prismaClient.transaction.findMany({
        where: { productId: { in: productIds } },
        include: {
          product: true,
          buyer: true,
          seller: true,
        },
      })
    } catch (error) {
      throw new GraphQLError('Failed to fetch transactions by product', {
        extensions: { code: 'DATABASE_ERROR', error: (error as Error).message },
      })
    }
  }

  async findTransactionsByBuyer(buyerIds: string[]) {
    try {
      return await this.prismaClient.transaction.findMany({
        where: { buyerId: { in: buyerIds } },
        include: {
          product: true,
          buyer: true,
          seller: true,
        },
      })
    } catch (error) {
      throw new GraphQLError('Failed to fetch transactions by buyer', {
        extensions: { code: 'DATABASE_ERROR', error: (error as Error).message },
      })
    }
  }

  async findTransactionsBySeller(sellerIds: string[]) {
    try {
      return await this.prismaClient.transaction.findMany({
        where: { sellerId: { in: sellerIds } },
        include: {
          product: true,
          buyer: true,
          seller: true,
        },
      })
    } catch (error) {
      throw new GraphQLError('Failed to fetch transactions by seller', {
        extensions: { code: 'DATABASE_ERROR', error: (error as Error).message },
      })
    }
  }

  async createTransaction(createTransactionBody: CreateTransactionBody) {
    try {
      const { buyerId, sellerId, productId, price } = createTransactionBody
      return await this.prismaClient.$transaction(
        async (
          prisma: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>
        ) => {
          const newTransaction = await prisma.transaction.create({
            data: {
              product: {
                connect: { id: productId },
              },
              buyer: {
                connect: { id: buyerId },
              },
              seller: {
                connect: { id: sellerId },
              },
              price: price,
            },
            include: {
              product: true,
              buyer: true,
              seller: true,
            },
          })

          await prisma.product.update({
            where: { id: productId },
            data: { isAvailable: false },
          })

          return newTransaction
        }
      )
    } catch (error) {
      throw new GraphQLError('Failed to save transaction to database', {
        extensions: { code: 'DATABASE_ERROR', error: (error as Error).message },
      })
    }
  }
}
