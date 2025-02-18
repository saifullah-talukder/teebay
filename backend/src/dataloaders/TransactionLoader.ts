import DataLoader from 'dataloader'
import { prismaClient } from '../providers/PrismaClient'
import Loader from './Loader'

export class TransactionLoader extends Loader {
  transactionsByProductIdLoader = new DataLoader(async (productIds: readonly string[]) => {
    const transactions = await prismaClient.transaction.findMany({
      where: { productId: { in: productIds as string[] } },
    })
    return productIds.map(id => transactions.filter(transaction => transaction.productId === id))
  })

  register() {
    return { transactionsByProductIdLoader: this.transactionsByProductIdLoader }
  }
}
