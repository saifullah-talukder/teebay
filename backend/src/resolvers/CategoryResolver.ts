import { FindCategoriesService } from '../services/category/FindCategoriesService'
import { Context } from '../types/Apollo'
import Resolver from './Resolver'

export class CategoryTypeResolver extends Resolver {
  async products(parent: { name: string }, _: any, context: Context) {
    return await context.loaders.productLoader.loadProductsByCategory.load(parent.name)
  }

  register() {
    return {
      products: this.products.bind(this),
    }
  }
}

export class CategoryQueryResolver extends Resolver {
  async categories(_: any, __: any, context: Context) {
    return await new FindCategoriesService().execute()
  }

  register() {
    return {
      categories: this.categories.bind(this),
    }
  }
}
