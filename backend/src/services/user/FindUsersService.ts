import { UserRepository } from '../../database/UserRepository'
import { Service } from '../Service'

export class FindUsersService extends Service {
  userRepository: UserRepository

  constructor() {
    super()
    this.userRepository = new UserRepository()
  }

  async execute() {
    return await this.userRepository.findUsers()
  }
}
