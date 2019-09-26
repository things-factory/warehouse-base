import { gql } from 'apollo-server-koa'

export const Inventory = gql`
  type Inventory {
    id: String
    domain: Domain
    bizplace: Bizplace
    name: String
    palletId: String
    batchId: String
    productId: String
    location: Location
    movements: [Movement]
    startQty: Int
    qty: Int
    endQty: Int
    status: String
    description: String
    creator: User
    updater: User
    createdAt: String
    updatedAt: String
  }
`
