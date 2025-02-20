import { DataLoaders } from '../../providers/DataLoaders'
import { Service } from '../Service'

export class FindTransactionsBySellerService extends Service {
  constructor(private sellerId: string, private loaders: DataLoaders) {
    super()
  }

  async execute() {
    return await this.loaders.transactionLoader.loadTransactionsBySeller.load(this.sellerId)
  }
}
