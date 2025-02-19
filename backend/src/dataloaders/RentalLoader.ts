import DataLoader from 'dataloader'
import { prismaClient } from '../providers/PrismaClient'
import Loader from './Loader'

export class RentalLoader extends Loader {
  loadRentalsByProductId = new DataLoader(async (productIds: readonly string[]) => {
    const rentals = await prismaClient.rental.findMany({
      where: { productId: { in: productIds as string[] } },
    })
    return productIds.map(id => rentals.filter(rental => rental.productId === id))
  })

  loadRentalsByOwner = new DataLoader(async (userIds: readonly string[]) => {
    const rentals = await prismaClient.rental.findMany({
      where: { ownerId: { in: userIds as string[] } },
    })

    const rentalsByOwner = userIds.map(userId => {
      return rentals.filter(rentar => rentar.ownerId === userId)
    })

    return rentalsByOwner
  })

  loadRentalsByRenter = new DataLoader(async (userIds: readonly string[]) => {
    const rentals = await prismaClient.rental.findMany({
      where: { renterId: { in: userIds as string[] } },
    })

    const rentalsByRenter = userIds.map(userId => {
      return rentals.filter(rentar => rentar.renterId === userId)
    })

    return rentalsByRenter
  })

  register() {
    return {
      loadRentalsByProductId: this.loadRentalsByProductId,
      loadRentalsByOwner: this.loadRentalsByOwner,
      loadRentalsByRenter: this.loadRentalsByRenter,
    }
  }
}
