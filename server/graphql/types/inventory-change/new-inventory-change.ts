import gql from 'graphql-tag'

export const NewInventoryChange = gql`
  input NewInventoryChange {
    name: String!
    description: String
  }
`
