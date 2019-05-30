import { gql } from 'apollo-server-koa'

export const NewInventory = gql`
  input NewInventory {
    name: String!
    description: String
  }
`
