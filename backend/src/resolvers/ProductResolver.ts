import { getUserId } from '../middleware/Auth'
import { CreateProductService } from '../services/product/CreateProductService'
import { DeleteProductService } from '../services/product/DeleteProductService'
import { FindProductByIdService } from '../services/product/FindProductByIdService'
import { FindProductsByOwnerService } from '../services/product/FindProductsByOwnerService'
import { FindProductsService } from '../services/product/FindProductsService'
import { UpdateProductService } from '../services/product/UpdateProductService'
import { Context } from '../types/Apollo'
import { CreateProductPayload, validateCreateProductPayload } from '../validation/product/CreateProductMutation'
import { DeleteProductPayload, validateDeleteProductPayload } from '../validation/product/DeleteProductMutation'
import { UpdateProductPayload, validateUpdateProductPayload } from '../validation/product/UpdateProductMutation'
import Resolver from './Resolver'

export class ProductTypeResolver extends Resolver {
  async owner(parent: { ownerId: string }, _: any, context: Context) {
    return await context.loaders.userLoader.loadUsersById.load(parent.ownerId)
  }

  async categories(parent: { id: string }, _: any, context: Context) {
    return await context.loaders.categoryLoader.loadCategoriesByProducts.load(parent.id)
  }

  register() {
    return {
      owner: this.owner.bind(this),
      categories: this.categories.bind(this),
    }
  }
}

export class ProductQueryResolver extends Resolver {
  async products(_: any, __: any, context: Context) {
    return await new FindProductsService().execute()
  }

  async product(_: any, { id }: { id: string }, context: Context) {
    return await new FindProductByIdService(id, context.loaders).execute()
  }

  async productsByOwner(_: any, __: any, context: Context) {
    const userId = getUserId(context)
    return await new FindProductsByOwnerService(userId, context.loaders).execute()
  }

  register() {
    return {
      products: this.products.bind(this),
      product: this.product.bind(this),
      productsByOwner: this.productsByOwner.bind(this),
    }
  }
}

export class ProductMutationResolver extends Resolver {
  async createProduct(_: any, payload: CreateProductPayload, context: Context) {
    const userId = getUserId(context)
    const createProductPayload = validateCreateProductPayload(payload)
    return await new CreateProductService(userId, createProductPayload).execute()
  }

  async updateProduct(_: any, payload: UpdateProductPayload, context: Context) {
    const userId = getUserId(context)
    const updateProductPayload = validateUpdateProductPayload(payload)
    return await new UpdateProductService(userId, updateProductPayload, context.loaders).execute()
  }

  async deleteProduct(_: any, payload: DeleteProductPayload, context: Context) {
    const userId = getUserId(context)
    const { id } = validateDeleteProductPayload(payload)
    await new DeleteProductService(userId, id, context.loaders).execute()
    return true
  }

  register() {
    return {
      createProduct: this.createProduct.bind(this),
      updateProduct: this.updateProduct.bind(this),
      deleteProduct: this.deleteProduct.bind(this),
    }
  }
}
