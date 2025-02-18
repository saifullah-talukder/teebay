import { prismaClient } from '../providers/PrismaClient'
import StartupJob from './StartupJob'

export class DatabaseInitializationJob extends StartupJob {
  async execute() {
    try {
      const categoriesCount = await prismaClient.category.count()

      if (categoriesCount === 0) {
        const categories = [
          { name: 'ELECTRONICS' },
          { name: 'FURNITURE' },
          { name: 'HOME APPLIANCES' },
          { name: 'SPORTING GOODS' },
          { name: 'OUTDOOR' },
          { name: 'TOYS' },
        ]

        for (const category of categories) {
          await prismaClient.category.create({
            data: category,
          })
        }

        console.log('Categories seeded successfully!')
      }
    } catch (error) {
      console.error('Error seeding database:', error)
    }
  }
}
