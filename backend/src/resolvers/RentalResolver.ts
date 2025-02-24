import { getUserId } from '../middleware/Auth'
import { FindRentalsByOwnerService } from '../services/rental/FindRentalsByOwnerService'
import { FindRentalsByProductService } from '../services/rental/FindRentalsByProductService'
import { FindRentalsByRenterService } from '../services/rental/FindRentalsByRenterService'
import { RentProductService } from '../services/rental/RentProductService'
import { Context } from '../types/Apollo'
import { RentalsByProductPayload, validateRentalsByProductPayload } from '../validation/rental/RentalsByProductQuery'
import { RentProductPayload, validateRentProductPayload } from '../validation/rental/RentProductMutation'
import Resolver from './Resolver'

export class RentalTypeResolver extends Resolver {
  async product(parent: { productId: string }, _: any, context: Context) {
    return await context.loaders.productLoader.loadProductsById.load(parent.productId)
  }

  async renter(parent: { renterId: string }, _: any, context: Context) {
    return await context.loaders.userLoader.loadUsersById.load(parent.renterId)
  }

  async owner(parent: { ownerId: string }, _: any, context: Context) {
    return await context.loaders.userLoader.loadUsersById.load(parent.ownerId)
  }

  register() {
    return {
      product: this.product.bind(this),
      renter: this.renter.bind(this),
      owner: this.owner.bind(this),
    }
  }
}

export class RentalQueryResolver extends Resolver {
  async rentalsByOwner(_: any, __: any, context: Context) {
    const userId = getUserId(context)
    return await new FindRentalsByOwnerService(userId, context.loaders).execute()
  }

  async rentalsByRenter(_: any, __: any, context: Context) {
    const userId = getUserId(context)
    return await new FindRentalsByRenterService(userId, context.loaders).execute()
  }

  async rentalsByProduct(_: any, payload: RentalsByProductPayload, context: Context) {
    const userId = getUserId(context)
    const { productId } = validateRentalsByProductPayload(payload)
    return await new FindRentalsByProductService(productId, userId, context.loaders).execute()
  }

  register() {
    return {
      rentalsByOwner: this.rentalsByOwner.bind(this),
      rentalsByRenter: this.rentalsByRenter.bind(this),
      rentalsByProduct: this.rentalsByProduct.bind(this),
    }
  }
}

export class RentalMutationResolver extends Resolver {
  async rentProduct(_: any, payload: RentProductPayload, context: Context) {
    const renterId = getUserId(context)
    const rentProductPayload = validateRentProductPayload(payload)
    return await new RentProductService(renterId, rentProductPayload, context.loaders).execute()
  }

  register() {
    return {
      rentProduct: this.rentProduct.bind(this),
    }
  }
}
