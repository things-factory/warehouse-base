import { gql } from 'apollo-server-koa'

export const Location = gql`
  type Location {
    id: String
    domain: Domain
    warehouse: Warehouse
    name: String
    zone: String
    section: String
    unit: String
    shelf: String
    state: String
    description: String
    creator: User
    updater: User
    createdAt: Date
    updatedAt: Date
  }
`
