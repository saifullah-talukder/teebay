import DataLoader from 'dataloader'
import { UserRepository } from '../database/UserRepository'
import { prismaClient } from '../providers/PrismaClient'
import Loader from './Loader'

export class UserLoader extends Loader {
  userRepository: UserRepository

  constructor() {
    super()
    this.userRepository = new UserRepository()
  }

  loadUsersById = new DataLoader(async (userIds: readonly string[]) => {
    const users = await this.userRepository.findUsersByIds(userIds as string[])
    return userIds.map(id => users.find((user: (typeof users)[0]) => user.id === id) || null)
  })

  loadUsersByEmail = new DataLoader(async (emails: readonly string[]) => {
    const users = await this.userRepository.findUsersByEmails(emails as string[])
    return emails.map(email => users.find((user: (typeof users)[0]) => user.email === email) || null)
  })

  loadUsersByProductOwner = new DataLoader(async (userIds: readonly string[]) => {
    const users = await prismaClient.user.findMany({
      where: { id: { in: userIds as string[] } },
    })

    return userIds.map(id => users.find((user: (typeof users)[0]) => user.id === id) || null)
  })

  register() {
    return {
      loadUsersById: this.loadUsersById,
      loadUsersByEmail: this.loadUsersByEmail,
      loadUsersByProductOwner: this.loadUsersByProductOwner,
    }
  }
}
