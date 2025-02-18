import { PrismaClient } from '@prisma/client'
import express from 'express'

export type Context = {
  prismaClient: PrismaClient
  req: express.Request
}
