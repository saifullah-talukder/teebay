import express from 'express'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { typeDefs } from './schemas/typeDefs'
import { resolvers } from './resolvers'
import bodyParser from 'body-parser'

async function startGraphQLServer() {
  const app = express()

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  await server.start()

  app.use('/graphql', bodyParser.json(), expressMiddleware(server))

  app.listen(4000, () => {
    console.log('🚀 Server ready at http://localhost:4000/graphql')
  })
}

startGraphQLServer().catch(error => {
  console.error('Error starting server:', error)
})
