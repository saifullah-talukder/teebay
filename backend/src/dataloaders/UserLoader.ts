import DataLoader from 'dataloader'
import { prismaClient } from '../providers/PrismaClient'
import Loader from './Loader'

export class UserLoader extends Loader {
  loadUsersById = new DataLoader(async (userIds: readonly string[]) => {
    const users = await prismaClient.user.findMany({
      where: { id: { in: userIds as string[] } },
    })

    // Map results to ensure they're returned in the same order as requested
    return userIds.map(id => users.find(user => user.id === id) || null)
  })

  register() {
    return { loadUsersById: this.loadUsersById }
  }
}
