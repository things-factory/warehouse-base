import { gql } from 'apollo-server-koa'

export const NewInventory = gql`
  input NewInventory {
    name: String!
    productBatch: [String]!
    qty: Int!
    description: String
  }
`
