import { gql } from '@apollo/client'

export const RENT_PRODUCT = gql`
  mutation RentProduct($productId: ID!, $startDate: String!, $endDate: String!) {
    rentProduct(productId: $productId, startDate: $startDate, endDate: $endDate) {
      id
      renter {
        id
        firstName
        lastName
      }
      owner {
        id
        firstName
        lastName
      }
      price
      startDate
      endDate
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
