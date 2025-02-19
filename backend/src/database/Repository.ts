import { prismaClient } from '../providers/PrismaClient'

export default class Repository {
  prismaClient = prismaClient

  constructor() {}
}
