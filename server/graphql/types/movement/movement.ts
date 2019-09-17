import { gql } from 'apollo-server-koa'

export const Movement = gql`
  type Movement {
    id: String
    domain: Domain
    bizplace: Bizplace
    inventory: Inventory
    inQty: Int
    outQty: Int
    description: String
    creator: User
    updater: User
    createdAt: String
    updatedAt: String
  }
`
