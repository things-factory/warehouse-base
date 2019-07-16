import { gql } from 'apollo-server-koa'

export const Movement = gql`
  type Movement {
    id: String
    domain: Domain
    date: String
    warehouse: Warehouse
    bizplace: Bizplace
    product: Product
    startQty: Int
    inQty: Int
    outQty: Int
    endQty: Int
    description: String
    creator: User
    updater: User
    createdAt: String
    updatedAt: String
  }
`
