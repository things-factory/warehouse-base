import { gql } from 'apollo-server-koa'

export const Warehouse = gql`
  type Warehouse {
    id: String
    domain: Domain
    bizplace: Bizplace
    name: String
    locations: [Location]
    description: String
    creator: User
    updater: User
    createdAt: String
    updatedAt: String
  }
`
