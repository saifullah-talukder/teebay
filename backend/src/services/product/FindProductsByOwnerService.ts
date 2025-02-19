import { DataLoaders } from '../../providers/DataLoaders'
import { Service } from '../Service'

export class FindProductsByOwnerService extends Service {
  constructor(private ownerId: string, private loaders: DataLoaders) {
    super()
  }

  async execute() {
    return await this.loaders.productLoader.loadProductsByOwner.load(this.ownerId)
  }
}
