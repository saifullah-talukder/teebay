import { AuthResolver } from '../resolvers/AuthResolver'
import { CategoryQueryResolver, CategoryTypeResolver } from '../resolvers/CategoryResolver'
import { ProductMutationResolver, ProductQueryResolver, ProductTypeResolver } from '../resolvers/ProductResolver'
import { RentalMutationResolver, RentalQueryResolver, RentalTypeResolver } from '../resolvers/RentalResolver'
import {
  TransactionMutationResolver,
  TransactionQueryResolver,
  TransactionTypeResolver,
} from '../resolvers/TransactionResolver'
import { UserQueryResolver, UserTypeResolver } from '../resolvers/UserResolver'

export function registerGraphQLResolvers() {
  const queryResolver = {
    ...new UserQueryResolver().register(),
    ...new ProductQueryResolver().register(),
    ...new TransactionQueryResolver().register(),
    ...new RentalQueryResolver().register(),
    ...new CategoryQueryResolver().register(),
  }

  const mutaionResolver = {
    ...new AuthResolver().register(),
    ...new ProductMutationResolver().register(),
    ...new TransactionMutationResolver().register(),
    ...new RentalMutationResolver().register(),
  }

  return {
    Query: queryResolver,
    Mutation: mutaionResolver,
    User: new UserTypeResolver().register(),
    Product: new ProductTypeResolver().register(),
    Category: new CategoryTypeResolver().register(),
    Transaction: new TransactionTypeResolver().register(),
    Rental: new RentalTypeResolver().register(),
  }
}
