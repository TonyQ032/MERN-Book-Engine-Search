import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        bookCount
        savedBooks {
          bookId
          authors
          description
          title
          image
          link
        }
      }
    }
  }
`

export const ADD_USER = gql`
  mutation addUser()
`

export const SAVE_BOOK = gql`
  mutation saveBook()
`

export const REMOVE_BOOK = gql`
  mutation removeBook()
`