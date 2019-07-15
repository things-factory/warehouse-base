import { gql } from 'apollo-server-koa'

export const Movement = gql`
  type Movement {
    id: String
    domain: Domain
    date: Date
    warehouse: Warehouse
    bizplace: Bizplace
    product: Product
    startQty: number
    inQty: number
    outQty: number
    endQty: number
    description: String
    creator: User
    updater: User
    createdAt: Date
    updatedAt: Date
  }
`
