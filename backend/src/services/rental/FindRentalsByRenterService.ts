import { DataLoaders } from '../../providers/DataLoaders'
import { Service } from '../Service'

export class FindRentalsByRenterService extends Service {
  constructor(private renterId: string, private loaders: DataLoaders) {
    super()
  }

  async execute() {
    return await this.loaders.rentalLoader.loadRentalsByRenter.load(this.renterId)
  }
}
