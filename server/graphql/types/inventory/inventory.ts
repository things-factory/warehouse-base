import { gql } from 'apollo-server-koa'

export const Inventory = gql`
  type Inventory {
    id: String
    domain: Domain
    name: String
    product: Product
    locations: [Location]
    movements: [Movement]
    startQty: Int
    endQty: Int
    status: String
    description: String
    creator: User
    updater: User
    createdAt: String
    updatedAt: String
  }
`
