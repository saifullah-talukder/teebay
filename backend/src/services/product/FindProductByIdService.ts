import { DataLoaders } from '../../providers/DataLoaders'
import { Service } from '../Service'

export class FindProductByIdService extends Service {
  constructor(private productId: string, private loaders: DataLoaders) {
    super()
  }

  async execute() {
    return await this.loaders.productLoader.loadProductsById.load(this.productId)
  }
}
