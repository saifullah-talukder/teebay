import DataLoader from 'dataloader'
import { prismaClient } from '../providers/PrismaClient'
import Loader from './Loader'
import { UserRepository } from '../database/UserRepository'

export class UserLoader extends Loader {
  userRepository: UserRepository

  constructor() {
    super()
    this.userRepository = new UserRepository()
  }

  loadUsersById = new DataLoader(async (userIds: readonly string[]) => {
    const users = await this.userRepository.findUsersByIds(userIds as string[])
    return userIds.map(id => users.find(user => user.id === id) || null)
  })

  loadUsersByEmail = new DataLoader(async (emails: readonly string[]) => {
    const users = await this.userRepository.findUsersByEmails(emails as string[])
    return emails.map(email => users.find(user => user.email === email) || null)
  })

  loadUsersByProductOwner = new DataLoader(async (userIds: readonly string[]) => {
    const users = await prismaClient.user.findMany({
      where: { id: { in: userIds as string[] } },
    })

    return userIds.map(id => users.find(user => user.id === id) || null)
  })

  register() {
    return {
      loadUsersById: this.loadUsersById,
      loadUsersByEmail: this.loadUsersByEmail,
      loadUsersByProductOwner: this.loadUsersByProductOwner,
    }
  }
}
