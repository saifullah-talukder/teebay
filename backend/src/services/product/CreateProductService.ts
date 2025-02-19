import { ProductRepository } from '../../database/ProductRepository'
import { CreateProductPayload } from '../../validation/product/CreateProductMutation'
import { Service } from '../Service'

export class CreateProductService extends Service {
  productRepository: ProductRepository

  constructor(private userId: string, private createProductPayload: CreateProductPayload) {
    super()
    this.productRepository = new ProductRepository()
  }

  async execute() {
    return await this.productRepository.createProduct(this.userId, this.createProductPayload)
  }
}
