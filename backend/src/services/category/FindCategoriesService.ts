import { CategoryRepository } from '../../database/CategoryRepository'
import { Service } from '../Service'

export class FindCategoriesService extends Service {
  categoryRepository: CategoryRepository

  constructor() {
    super()
    this.categoryRepository = new CategoryRepository()
  }

  async execute() {
    return await this.categoryRepository.findCategories()
  }
}
