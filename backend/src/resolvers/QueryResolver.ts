import { Context } from '../types/Apollo'
import { getUserId } from '../utils/Auth'
import { CategoryQueryResolver } from './CategoryResolver'
import { ProductQueryResolver } from './ProductResolver'
import { RentalQueryResolver } from './RentalResolver'
import Resolver from './Resolver'
import { TransactionQueryResolver } from './TransactionResolver'
import { UserQueryResolver } from './UserResolver'

export class QueryResolver extends Resolver {
  register() {
    return {
      ...new UserQueryResolver().register(),
      ...new ProductQueryResolver().register(),
      ...new TransactionQueryResolver().register(),
      ...new RentalQueryResolver().register(),
      ...new CategoryQueryResolver().register(),
    }
  }
}
