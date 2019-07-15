import { gql } from 'apollo-server-koa'

export const Inventory = gql`
  type Inventory {
    id: String
    domain: Domain
    name: String
    productBatch: ProductBatch
    lot: Lot
    qty: number
    description: String
    creator: User
    updater: User
    createdAt: Date
    updatedAt: Date
  }
`
