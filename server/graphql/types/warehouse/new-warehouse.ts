import { gql } from 'apollo-server-koa'

export const NewWarehouse = gql`
  input NewWarehouse {
    name: String!
    locations: [String]!
    description: String
  }
`
