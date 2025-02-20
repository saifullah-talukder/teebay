import { DataLoaders } from '../../providers/DataLoaders'
import { Service } from '../Service'

export class FindTransactionsByBuyerService extends Service {
  constructor(private buyerId: string, private loaders: DataLoaders) {
    super()
  }

  async execute() {
    return await this.loaders.transactionLoader.loadTransactionsByBuyer.load(this.buyerId)
  }
}
