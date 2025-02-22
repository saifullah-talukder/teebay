import { GraphQLError } from 'graphql'
import { ProductRepository } from '../../database/ProductRepository'
import { DataLoaders } from '../../providers/DataLoaders'
import { Service } from '../Service'

export class DeleteProductService extends Service {
  productRepository: ProductRepository

  constructor(private userId: string, private productId: string, private loaders: DataLoaders) {
    super()
    this.productRepository = new ProductRepository()
  }

  async execute() {
    const existingProduct = await this.loaders.productLoader.loadProductsById.load(this.productId)

    if (!existingProduct) {
      throw new GraphQLError('Product not found', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    if (existingProduct.ownerId !== this.userId) {
      throw new GraphQLError('Not authorized to delete this product', {
        extensions: { code: 'FORBIDDEN' },
      })
    }

    const transactions = await this.loaders.transactionLoader.loadTransactionsByProduct.load(this.productId)
    const rentals = await this.loaders.rentalLoader.loadRentalsByProduct.load(this.productId)

    if (transactions.length > 0 || rentals.length > 0) {
      throw new GraphQLError('Cannot delete product that has transactions or rentals', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    return await this.productRepository.deleteProduct(this.productId)
  }
}
