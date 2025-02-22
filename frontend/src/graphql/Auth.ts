import { gql } from '@apollo/client'

export const SIGN_UP = gql`
  mutation signup(
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
    $address: String!
    $phone: String!
  ) {
    signup(
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
      address: $address
      phone: $phone
    ) {
      id
      email
      firstName
      lastName
      address
      phone
    }
  }
`

export const SIGN_IN = gql`
  mutation signin($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      token
      user {
        id
        email
        firstName
        lastName
        address
        phone
      }
    }
  }
`
