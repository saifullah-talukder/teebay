import { CategoryResolver } from '../resolvers/CategoryResolver'
import { MutationResolver } from '../resolvers/MutationResolver'
import { ProductResolver } from '../resolvers/ProductResolver'
import { QueryResolver } from '../resolvers/QueryResolver'
import { RentalResolver } from '../resolvers/RentalResolver'
import { TransactionResolver } from '../resolvers/TransactionResolver'
import { UserResolver } from '../resolvers/UserResolver'

export function registerGraphQLResolvers() {
  return {
    Query: new QueryResolver().register(),
    Mutation: new MutationResolver().register(),
    User: new UserResolver().register(),
    Product: new ProductResolver().register(),
    Category: new CategoryResolver().register(),
    Transaction: new TransactionResolver().register(),
    Rental: new RentalResolver().register(),
  }
}
