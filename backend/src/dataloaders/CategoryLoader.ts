import DataLoader from 'dataloader'
import { prismaClient } from '../providers/PrismaClient'
import Loader from './Loader'

export class CategoryLoader extends Loader {
  categoriesOfProductsLoader = new DataLoader(async (productIds: readonly string[]) => {
    // Get all categories for all requested product IDs in one query
    const productCategories = await prismaClient.category.findMany({
      where: {
        products: {
          some: {
            id: { in: productIds as string[] },
          },
        },
      },
      include: {
        products: {
          select: { id: true },
        },
      },
    })

    // Group categories by product ID
    return productIds.map(productId =>
      productCategories.filter(category => category.products.some(product => product.id === productId))
    )
  })

  register() {
    return { categoriesOfProductsLoader: this.categoriesOfProductsLoader }
  }
}
