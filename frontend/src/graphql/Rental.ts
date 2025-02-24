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

export const GET_BORROWED_PRODUCTS = gql`
  query GetBorrowedProducts {
    me {
      rentedProducts {
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
  }
`

export const GET_LENT_PRODUCTS = gql`
  query GetLentProducts {
    me {
      lentProducts {
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
  }
`

export const GET_RENTALS_BY_PRODUCT = gql`
  query GetRentalsByProduct($productId: ID!) {
    rentalsByProduct(productId: $productId) {
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
