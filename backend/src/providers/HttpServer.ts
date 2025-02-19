import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import bodyParser from 'body-parser'
import express, { Express } from 'express'
import { readFileSync } from 'fs'
import path from 'path'
import { Context } from '../types/Apollo'
import { registerDataLoaders } from './DataLoaders'
import { registerGraphQLResolvers } from './GraphQLResolvers'

const typeDefs = readFileSync(path.join(__dirname, '..', '..', 'schema.graphql'), 'utf-8')

export async function createHttpServer(): Promise<Express> {
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers: registerGraphQLResolvers(),
    formatError: error => {
      console.error('Server error:', error)
      return {
        message: error.message,
        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
      }
    },
  })

  await server.start()

  const app = express()
  // app.use(
  //   cors({
  //     origin: [],
  //     // optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  //   })
  // )
  app.use(bodyParser.json())

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }): Promise<Context> => ({
        req,
        loaders: registerDataLoaders(),
      }),
    })
  )

  return app
}
