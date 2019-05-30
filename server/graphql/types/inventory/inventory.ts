import { gql } from 'apollo-server-koa'

export const Inventory = gql`
  type Inventory {
    id: String
    name: String
    domain: Domain
    description: String
  }
`
