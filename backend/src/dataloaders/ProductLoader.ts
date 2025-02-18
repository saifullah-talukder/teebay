import DataLoader from 'dataloader'
import { prismaClient } from '../providers/PrismaClient'
import Loader from './Loader'

export class ProductLoader extends Loader {
  productsByIdLoader = new DataLoader(async (ids: readonly string[]) => {
    const products = await prismaClient.product.findMany({
      where: { id: { in: ids as string[] } },
      include: {
        owner: true,
        categories: true,
      },
    })

    // Ensure we return products in the same order as the requested ids
    return ids.map(id => products.find(product => product.id === id) || null)
  })

  productsOfUsersLoader = new DataLoader(async (userIds: readonly string[]) => {
    const products = await prismaClient.product.findMany({
      where: { ownerId: { in: userIds as string[] } },
      include: {
        owner: true,
        categories: true,
      },
    })

    // Group products by ownerId
    const productsByOwner = userIds.map(userId => {
      return products.filter(product => product.ownerId === userId)
    })

    return productsByOwner
  })

  productsByCategoryLoader = new DataLoader(async (categories: readonly string[]) => {
    const products = await prismaClient.product.findMany({
      where: {
        categories: {
          some: {
            name: { in: categories as string[] },
          },
        },
      },
      include: {
        categories: true,
      },
    })

    // Map products to their respective categories
    const productsByCategory = categories.map(name => {
      return products.filter((product: any) => product.categories.some((category: any) => category.name === name))
    })

    return productsByCategory
  })

  register() {
    return {
      productsByIdLoader: this.productsByIdLoader,
      productsOfUsersLoader: this.productsOfUsersLoader,
      productsByCategoryLoader: this.productsByCategoryLoader,
    }
  }
}
