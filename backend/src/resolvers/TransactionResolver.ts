import { getUserId } from '../middleware/Auth'
import { BuyProductService } from '../services/transaction/BuyProductService'
import { FindTransactionsByBuyerService } from '../services/transaction/FindTransactionsByBuyerService'
import { FindTransactionsBySellerService } from '../services/transaction/FindTransactionsBySellerService'
import { Context } from '../types/Apollo'
import { BuyProductPayload, validateBuyProductPayload } from '../validation/transaction/BuyProductMutation'
import Resolver from './Resolver'

export class TransactionTypeResolver extends Resolver {
  async product(parent: { productId: string }, _: any, context: Context) {
    return await context.loaders.productLoader.loadProductsById.load(parent.productId)
  }

  async buyer(parent: { buyerId: string }, _: any, context: Context) {
    return await context.loaders.userLoader.loadUsersById.load(parent.buyerId)
  }

  async seller(parent: { sellerId: string }, _: any, context: Context) {
    return await context.loaders.userLoader.loadUsersById.load(parent.sellerId)
  }

  register() {
    return {
      product: this.product.bind(this),
      buyer: this.buyer.bind(this),
      seller: this.seller.bind(this),
    }
  }
}

export class TransactionQueryResolver extends Resolver {
  async transactionsBySeller(_: any, __: any, context: Context) {
    const userId = getUserId(context)
    return await new FindTransactionsBySellerService(userId, context.loaders).execute()
  }

  async transactionsByBuyer(_: any, __: any, context: Context) {
    const userId = getUserId(context)
    return await new FindTransactionsByBuyerService(userId, context.loaders).execute()
  }

  register() {
    return {
      transactionsBySeller: this.transactionsBySeller.bind(this),
      transactionsByBuyer: this.transactionsByBuyer.bind(this),
    }
  }
}

export class TransactionMutationResolver extends Resolver {
  async buyProduct(_: any, payload: BuyProductPayload, context: Context) {
    const buyerId = getUserId(context)
    const { productId } = validateBuyProductPayload(payload)
    return await new BuyProductService(buyerId, productId, context.loaders).execute()
  }

  register() {
    return {
      buyProduct: this.buyProduct.bind(this),
    }
  }
}
