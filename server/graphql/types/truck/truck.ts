import { gql } from 'apollo-server-koa'

export const Truck = gql`
  type Truck {
    id: String
    name: String
    domain: Domain
    description: String
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`
