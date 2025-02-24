import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { toast } from 'react-toastify'

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL,
})

export const updateAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('token', token)
  } else {
    localStorage.removeItem('token')
  }
}

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)

      if (
        message.toLowerCase().includes('not authenticated') ||
        message.toLowerCase().includes('unauthenticated') ||
        message.toLowerCase().includes('invalid token')
      ) {
        updateAuthToken(null)
        toast.error('Please sign in again')
        window.location.href = '/signin'
      }
    })
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`)
  }
})

const link = ApolloLink.from([errorLink, authLink, httpLink])

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          user: {
            read(_, { variables, toReference }) {
              return toReference({
                __typename: 'User',
                id: variables?.id,
              })
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})
