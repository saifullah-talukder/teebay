import DataLoader from 'dataloader'
import { CategoryRepository } from '../database/CategoryRepository'
import Loader from './Loader'

export class CategoryLoader extends Loader {
  categoryRepository: CategoryRepository

  constructor() {
    super()
    this.categoryRepository = new CategoryRepository()
  }

  loadCategoriesOfProducts = new DataLoader(async (productIds: readonly string[]) => {
    const productCategories = await this.categoryRepository.findCategoriesOfProducts(productIds as string[])

    return productIds.map(productId =>
      productCategories.filter(category => category.products.some(product => product.id === productId))
    )
  })

  register() {
    return { loadCategoriesOfProducts: this.loadCategoriesOfProducts }
  }
}
