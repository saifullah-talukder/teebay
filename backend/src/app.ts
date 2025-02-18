import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { json } from 'body-parser'
import cors from 'cors'
import express from 'express'
import { readFileSync } from 'fs'
import http from 'http'
import path from 'path'
import { prismaClient } from './providers/prismaClient'
import { resolvers } from './resolvers'
import { Context } from './types/apollo'

const typeDefs = readFileSync(path.join(__dirname, '..', 'schema.graphql'), 'utf-8')

async function startApolloServer() {
  const app = express()
  const httpServer = http.createServer(app)

  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    formatError: error => {
      console.error('Server error:', error)
      return {
        message: error.message,
        locations: error.locations,
        path: error.path,
      }
    },
  })

  await server.start()

  app.use(
    '/graphql',
    cors(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<Context> => ({
        prismaClient,
        req,
      }),
    })
  )

  const PORT = process.env.PORT || 4000
  await new Promise<void>(resolve => httpServer.listen({ port: PORT }, resolve))
  console.log(`Server running at http://localhost:${PORT}/graphql`)
}

async function initializeDatabase() {
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

const start = async () => {
  await initializeDatabase()
  await startApolloServer()
}

start()
