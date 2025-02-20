import { GraphQLError } from 'graphql'
import { TransactionRepository } from '../../database/TransactionRepository'
import { DataLoaders } from '../../providers/DataLoaders'
import { Service } from '../Service'

export class BuyProductService extends Service {
  transactionRepository: TransactionRepository

  constructor(private buyerId: string, private productId: string, private loaders: DataLoaders) {
    super()
    this.transactionRepository = new TransactionRepository()
  }

  async execute() {
    const product = await this.loaders.productLoader.loadProductsById.load(this.productId)

    if (!product) {
      throw new GraphQLError('Product not found', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    if (!product.isAvailable) {
      throw new GraphQLError('Product is not available for purchase', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    if (product.ownerId === this.buyerId) {
      throw new GraphQLError('Cannot buy your own product', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    return await this.transactionRepository.createTransaction({
      buyerId: this.buyerId,
      sellerId: product.ownerId,
      productId: this.productId,
      price: product.price,
    })
  }
}
