import { DataLoaders } from '../../providers/DataLoaders'
import { Service } from '../Service'

export class FindRentalsByOwnerService extends Service {
  constructor(private ownerId: string, private loaders: DataLoaders) {
    super()
  }

  async execute() {
    return await this.loaders.rentalLoader.loadRentalsByOwner.load(this.ownerId)
  }
}
