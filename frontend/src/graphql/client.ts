import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL,
})

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})
