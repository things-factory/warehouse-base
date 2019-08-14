import { gql } from 'apollo-server-koa'

export const Location = gql`
  type Location {
    id: String
    domain: Domain
    warehouse: Warehouse
    product: Product
    name: String
    zone: String
    row: String
    column: String
    shelf: String
    status: String
    description: String
    creator: User
    updater: User
    createdAt: String
    updatedAt: String
  }
`
