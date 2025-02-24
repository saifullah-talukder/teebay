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

export const GET_BOUGHT_PRODUCTS = gql`
  query GetBoughtProducts {
    me {
      boughtProducts {
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
  }
`

export const GET_SOLD_PRODUCTS = gql`
  query GetSoldProducts {
    me {
      soldProducts {
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
  }
`
