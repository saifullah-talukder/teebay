import { CategoriesFindService } from '../services/category/CategoriesFindService'
import { Context } from '../types/Apollo'
import Resolver from './Resolver'

export class CategoryTypeResolver extends Resolver {
  async products(parent: { name: string }, _: any, { loaders }: Context) {
    return loaders.productLoader.loadProductsByCategory.load(parent.name)
  }

  register() {
    return {
      products: this.products.bind(this),
    }
  }
}

export class CategoryQueryResolver extends Resolver {
  async categories(_: any, __: any, context: Context) {
    return await new CategoriesFindService().execute()
  }

  register() {
    return {
      categories: this.categories.bind(this),
    }
  }
}
