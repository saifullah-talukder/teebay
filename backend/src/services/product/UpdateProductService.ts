import { GraphQLError } from 'graphql'
import { omit } from 'lodash'
import { ProductRepository, UpdateProductBody } from '../../database/ProductRepository'
import { DataLoaders } from '../../providers/DataLoaders'
import { Service } from '../Service'

export class UpdateProductService extends Service {
  productRepository: ProductRepository

  constructor(private userId: string, private updateProductPayload: UpdateProductBody, private loaders: DataLoaders) {
    super()
    this.productRepository = new ProductRepository()
  }

  async execute() {
    const existingProduct = await this.loaders.productLoader.loadProductsById.load(this.updateProductPayload.id)

    if (!existingProduct) {
      throw new GraphQLError('Product not found', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    if (existingProduct.ownerId !== this.userId) {
      throw new GraphQLError('Not authorized to update this product', {
        extensions: { code: 'FORBIDDEN' },
      })
    }

    if (this.updateProductPayload?.categories) {
      await this.productRepository.updateProductCategories(
        this.updateProductPayload.id,
        this.updateProductPayload.categories
      )
    }

    return await this.productRepository.updateProduct(omit(this.updateProductPayload, 'categories'))
  }
}
