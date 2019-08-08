import { gql } from 'apollo-server-koa'

export const Inventory = gql`
  type Inventory {
    id: String
    domain: Domain
    name: String
    productBatch: ProductBatch
    qty: Int
    description: String
    creator: User
    updater: User
    createdAt: String
    updatedAt: String
  }
`
