import { gql } from 'apollo-server-koa'

export const NewLocation = gql`
  input NewLocation {
    warehouse: [String]!
    name: String!
    zone: String!
    row: String!
    column: String!
    shelf: String!
    status: String!
    description: String
  }
`
