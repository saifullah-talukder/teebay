import DataLoader from 'dataloader'
import { TransactionRepository } from '../database/TransactionRepository'
import Loader from './Loader'

export class TransactionLoader extends Loader {
  transactionRepository: TransactionRepository

  constructor() {
    super()
    this.transactionRepository = new TransactionRepository()
  }

  loadTransactionsByProduct = new DataLoader(async (productIds: readonly string[]) => {
    const transactions = await this.transactionRepository.findTransactionsByProduct(productIds as string[])
    return productIds.map(id =>
      transactions.filter((transaction: (typeof transactions)[0]) => transaction.productId === id)
    )
  })

  loadTransactionsBySeller = new DataLoader(async (sellerIds: readonly string[]) => {
    const transactions = await this.transactionRepository.findTransactionsBySeller(sellerIds as string[])
    return sellerIds.map(id =>
      transactions.filter((transaction: (typeof transactions)[0]) => transaction.sellerId === id)
    )
  })

  loadTransactionsByBuyer = new DataLoader(async (buyerIds: readonly string[]) => {
    const transactions = await this.transactionRepository.findTransactionsByBuyer(buyerIds as string[])
    return buyerIds.map(id =>
      transactions.filter((transaction: (typeof transactions)[0]) => transaction.buyerId === id)
    )
  })

  register() {
    return {
      loadTransactionsByProduct: this.loadTransactionsByProduct,
      loadTransactionsBySeller: this.loadTransactionsBySeller,
      loadTransactionsByBuyer: this.loadTransactionsByBuyer,
    }
  }
}
