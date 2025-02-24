import { gql } from '@apollo/client'

export const BUY_PRODUCT = gql`
  mutation BuyProduct($productId: ID!) {
    buyProduct(productId: $productId) {
      id
      buyer {
        id
        firstName
        lastName
      }
      seller {
        id
        firstName
        lastName
      }
      price
      createdAt
      product {
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
  }
`
