import DataLoader from 'dataloader'
import { prismaClient } from '../providers/PrismaClient'
import Loader from './Loader'

export class RentalLoader extends Loader {
  rentalsByProductIdLoader = new DataLoader(async (productIds: readonly string[]) => {
    const rentals = await prismaClient.rental.findMany({
      where: { productId: { in: productIds as string[] } },
    })
    return productIds.map(id => rentals.filter(rental => rental.productId === id))
  })

  register() {
    return { rentalsByProductIdLoader: this.rentalsByProductIdLoader }
  }
}
