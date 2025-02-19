import { CategoryLoader } from '../dataloaders/CategoryLoader'
import { ProductLoader } from '../dataloaders/ProductLoader'
import { RentalLoader } from '../dataloaders/RentalLoader'
import { TransactionLoader } from '../dataloaders/TransactionLoader'
import { UserLoader } from '../dataloaders/UserLoader'

export function registerDataLoaders() {
  return {
    categoryLoader: new CategoryLoader().register(),
    productLoader: new ProductLoader().register(),
    rentalLoader: new RentalLoader().register(),
    transactionLoader: new TransactionLoader().register(),
    userLoader: new UserLoader().register(),
  }
}

export type DataLoaders = ReturnType<typeof registerDataLoaders>
