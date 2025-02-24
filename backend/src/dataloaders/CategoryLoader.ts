import DataLoader from 'dataloader'
import { CategoryRepository } from '../database/CategoryRepository'
import Loader from './Loader'

export class CategoryLoader extends Loader {
  categoryRepository: CategoryRepository

  constructor() {
    super()
    this.categoryRepository = new CategoryRepository()
  }

  loadCategoriesByProducts = new DataLoader(async (productIds: readonly string[]) => {
    const productCategories = await this.categoryRepository.findCategoriesByProducts(productIds as string[])

    return productIds.map(productId =>
      productCategories.filter((category: (typeof productCategories)[0]) =>
        category.products.some((product: (typeof category.products)[0]) => product.id === productId)
      )
    )
  })

  register() {
    return { loadCategoriesByProducts: this.loadCategoriesByProducts }
  }
}
