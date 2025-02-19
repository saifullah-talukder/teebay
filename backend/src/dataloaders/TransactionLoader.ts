import DataLoader from 'dataloader'
import { prismaClient } from '../providers/PrismaClient'
import Loader from './Loader'

export class TransactionLoader extends Loader {
  loadTransactionsByProductId = new DataLoader(async (productIds: readonly string[]) => {
    const transactions = await prismaClient.transaction.findMany({
      where: { productId: { in: productIds as string[] } },
    })
    return productIds.map(id => transactions.filter(transaction => transaction.productId === id))
  })

  loadTransactionsBySeller = new DataLoader(async (userIds: readonly string[]) => {
    const transactions = await prismaClient.transaction.findMany({
      where: { sellerId: { in: userIds as string[] } },
    })

    const transactionsBySeller = userIds.map(userId => {
      return transactions.filter(transaction => transaction.sellerId === userId)
    })

    return transactionsBySeller
  })

  loadTransactionsByBuyer = new DataLoader(async (userIds: readonly string[]) => {
    const transactions = await prismaClient.transaction.findMany({
      where: { buyerId: { in: userIds as string[] } },
    })

    const transactionsByBuyer = userIds.map(userId => {
      return transactions.filter(transaction => transaction.buyerId === userId)
    })

    return transactionsByBuyer
  })

  register() {
    return {
      loadTransactionsByProductId: this.loadTransactionsByProductId,
      loadTransactionsBySeller: this.loadTransactionsBySeller,
      loadTransactionsByBuyer: this.loadTransactionsByBuyer,
    }
  }
}
