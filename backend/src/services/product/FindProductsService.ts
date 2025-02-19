import { ProductRepository } from '../../database/ProductRepository'
import { Service } from '../Service'

export class FindProductsService extends Service {
  productRepository: ProductRepository

  constructor() {
    super()
    this.productRepository = new ProductRepository()
  }

  async execute() {
    return await this.productRepository.findProducts()
  }
}
