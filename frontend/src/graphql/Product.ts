import { gql } from '@apollo/client'

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      title
      description
      price
      rentPrice
      isAvailable
      isRentable
      categories {
        name
      }
      createdAt
      updatedAt
      owner {
        id
        firstName
        lastName
      }
    }
  }
`

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      title
      description
      price
      rentPrice
      isAvailable
      isRentable
      categories {
        name
      }
      createdAt
      updatedAt
      owner {
        id
        firstName
        lastName
      }
    }
  }
`
