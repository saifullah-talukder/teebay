import { getUserId } from '../middleware/Auth'
import { FindUsersService } from '../services/user/FindUsersService'
import { Context } from '../types/Apollo'
import Resolver from './Resolver'

export class UserTypeResolver extends Resolver {
  async products(parent: { id: string }, _: any, context: Context) {
    return await context.loaders.productLoader.loadProductsByOwner.load(parent.id)
  }

  async boughtProducts(parent: { id: string }, _: any, context: Context) {
    return await context.loaders.transactionLoader.loadTransactionsByBuyer.load(parent.id)
  }

  async soldProducts(parent: { id: string }, _: any, context: Context) {
    return await context.loaders.transactionLoader.loadTransactionsBySeller.load(parent.id)
  }

  async rentedProducts(parent: { id: string }, _: any, context: Context) {
    return await context.loaders.rentalLoader.loadRentalsByRenter.load(parent.id)
  }

  async lentProducts(parent: { id: string }, _: any, context: Context) {
    return await context.loaders.rentalLoader.loadRentalsByOwner.load(parent.id)
  }

  register() {
    return {
      products: this.products.bind(this),
      boughtProducts: this.boughtProducts.bind(this),
      soldProducts: this.soldProducts.bind(this),
      rentedProducts: this.rentedProducts.bind(this),
      lentProducts: this.lentProducts.bind(this),
    }
  }
}

export class UserQueryResolver extends Resolver {
  async users(_: any, __: any, context: Context) {
    const userId = getUserId(context)
    return await new FindUsersService().execute()
  }

  async user(_: any, { id }: { id: string }, context: Context) {
    const userId = getUserId(context)
    return await context.loaders.userLoader.loadUsersById.load(id)
  }

  async me(_: any, __: any, context: Context) {
    const userId = getUserId(context)
    return await context.loaders.userLoader.loadUsersById.load(userId)
  }

  register() {
    return {
      users: this.users.bind(this),
      user: this.user.bind(this),
      me: this.me.bind(this),
    }
  }
}
