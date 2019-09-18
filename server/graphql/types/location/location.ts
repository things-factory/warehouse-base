import { gql } from 'apollo-server-koa'

export const Location = gql`
  type Location {
    id: String
    domain: Domain
    warehouse: Warehouse
    inventory: Inventory
    name: String
    description: String
    type: String
    zone: String
    row: String
    column: String
    shelf: String
    status: String
    creator: User
    updater: User
    createdAt: String
    updatedAt: String
  }
`
