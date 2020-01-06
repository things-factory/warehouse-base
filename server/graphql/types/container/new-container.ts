import gql from 'graphql-tag'

export const NewContainer = gql`
  input NewContainer {
    name: String!
    description: String
  }
`
