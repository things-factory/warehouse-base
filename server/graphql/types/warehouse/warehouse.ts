import { gql } from 'apollo-server-koa'

export const Warehouse = gql`
  type Warehouse {
    id: String
    name: String
    domain: Domain
    description: String
  }
`
