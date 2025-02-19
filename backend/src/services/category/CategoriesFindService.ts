import { CategoryRepository } from '../../database/CategoryRepository'
import { Service } from '../Service'

export class CategoriesFindService extends Service {
  categoryRepository = new CategoryRepository()

  async execute() {
    return await this.categoryRepository.findCategories()
  }
}
