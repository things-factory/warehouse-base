import { gql } from 'apollo-server-koa'

export const Inventory = gql`
  type Inventory {
    id: String
    domain: Domain
    bizplace: Bizplace
    name: String
    palletId: String
    batchId: String
    product: Product
    location: Location
    warehouse: Warehouse
    zone: String
    qty: Int
    lastSeq: Int
    status: String
    description: String
    creator: User
    updater: User
    createdAt: String
    updatedAt: String
  }
`
