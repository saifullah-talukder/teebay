import { DataLoaders } from '../../providers/DataLoaders'
import { Service } from '../Service'

export class FindRentalsByProductService extends Service {
  constructor(private productId: string, private userId: string, private loaders: DataLoaders) {
    super()
  }

  async execute() {
    return await this.loaders.rentalLoader.loadRentalsByProduct.load(this.productId)
  }
}
