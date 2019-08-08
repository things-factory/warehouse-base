import { gql } from 'apollo-server-koa'

export const InventoryPatch = gql`
  input InventoryPatch {
    name: String
    productBatch: [String]
    qty: Int
    description: String
  }
`
