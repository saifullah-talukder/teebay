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

export const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $title: String!
    $description: String!
    $price: Float!
    $rentPrice: Float
    $isRentable: Boolean!
    $categories: [String!]!
  ) {
    createProduct(
      title: $title
      description: $description
      price: $price
      rentPrice: $rentPrice
      isRentable: $isRentable
      categories: $categories
    ) {
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

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct(
    $id: ID!
    $title: String!
    $description: String!
    $price: Float!
    $rentPrice: Float
    $isRentable: Boolean!
    $categories: [String!]!
  ) {
    updateProduct(
      id: $id
      title: $title
      description: $description
      price: $price
      rentPrice: $rentPrice
      isRentable: $isRentable
      categories: $categories
    ) {
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

export const GET_MY_PRODUCTS = gql`
  query GetMyProducts {
    me {
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

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`
