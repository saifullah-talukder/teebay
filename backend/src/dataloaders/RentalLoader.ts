import DataLoader from 'dataloader'
import { RentalRepository } from '../database/RentalRepository'
import Loader from './Loader'

export class RentalLoader extends Loader {
  rentalRepository: RentalRepository

  constructor() {
    super()
    this.rentalRepository = new RentalRepository()
  }

  loadRentalsByProduct = new DataLoader(async (productIds: readonly string[]) => {
    const rentals = await this.rentalRepository.findRentalsByProduct(productIds as string[])
    return productIds.map(id => rentals.filter((rental: (typeof rentals)[0]) => rental.productId === id))
  })

  loadRentalsByOwner = new DataLoader(async (ownerIds: readonly string[]) => {
    const rentals = await this.rentalRepository.findRentalsByOwner(ownerIds as string[])
    return ownerIds.map(userId => {
      return rentals.filter((rental: (typeof rentals)[0]) => rental.ownerId === userId)
    })
  })

  loadRentalsByRenter = new DataLoader(async (renterIds: readonly string[]) => {
    const rentals = await this.rentalRepository.findRentalsByRenter(renterIds as string[])
    return renterIds.map(userId => {
      return rentals.filter((rental: (typeof rentals)[0]) => rental.renterId === userId)
    })
  })

  register() {
    return {
      loadRentalsByProduct: this.loadRentalsByProduct,
      loadRentalsByOwner: this.loadRentalsByOwner,
      loadRentalsByRenter: this.loadRentalsByRenter,
    }
  }
}
