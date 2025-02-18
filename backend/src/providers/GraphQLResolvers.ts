import { CategoryTypeResolver } from '../resolvers/CategoryResolver'
import { MutationResolver } from '../resolvers/MutationResolver'
import { ProductTypeResolver } from '../resolvers/ProductResolver'
import { QueryResolver } from '../resolvers/QueryResolver'
import { RentalTypeResolver } from '../resolvers/RentalResolver'
import { TransactionTypeResolver } from '../resolvers/TransactionResolver'
import { UserTypeResolver } from '../resolvers/UserResolver'

export function registerGraphQLResolvers() {
  return {
    Query: new QueryResolver().register(),
    Mutation: new MutationResolver().register(),
    User: new UserTypeResolver().register(),
    Product: new ProductTypeResolver().register(),
    Category: new CategoryTypeResolver().register(),
    Transaction: new TransactionTypeResolver().register(),
    Rental: new RentalTypeResolver().register(),
  }
}
