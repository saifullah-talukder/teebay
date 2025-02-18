import { AuthResolver } from './AuthResolver'
import { ProductMutationResolver } from './ProductResolver'
import { RentalMutationResolver } from './RentalResolver'
import Resolver from './Resolver'
import { TransactionMutationResolver } from './TransactionResolver'

export class MutationResolver extends Resolver {
  register() {
    return {
      ...new AuthResolver().register(),
      ...new ProductMutationResolver().register(),
      ...new TransactionMutationResolver().register(),
      ...new RentalMutationResolver().register(),
    }
  }
}
