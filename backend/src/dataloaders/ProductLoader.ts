import DataLoader from 'dataloader'
import { ProductRepository } from '../database/ProductRepository'
import Loader from './Loader'

export class ProductLoader extends Loader {
  productRepository: ProductRepository

  constructor() {
    super()
    this.productRepository = new ProductRepository()
  }

  loadProductsById = new DataLoader(async (ids: readonly string[]) => {
    const products = await this.productRepository.findProductsById(ids as string[])
    return ids.map(id => products.find(product => product.id === id) || null)
  })

  loadProductsByOwner = new DataLoader(async (userIds: readonly string[]) => {
    const products = await this.productRepository.findProductsByOwner(userIds as string[])
    return userIds.map(userId => products.filter(product => product.ownerId === userId))
  })

  loadProductsByCategory = new DataLoader(async (categories: readonly string[]) => {
    const products = await this.productRepository.findProductsByCategory(categories as string[])
    const productsByCategory = categories.map(categoryName =>
      products.filter((product: any) => product.categories.some((category: any) => category.name === categoryName))
    )
    return productsByCategory
  })

  register() {
    return {
      loadProductsById: this.loadProductsById,
      loadProductsByOwner: this.loadProductsByOwner,
      loadProductsByCategory: this.loadProductsByCategory,
    }
  }
}
