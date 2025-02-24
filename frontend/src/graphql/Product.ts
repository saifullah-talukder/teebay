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

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`
