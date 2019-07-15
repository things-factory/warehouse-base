import { gql } from 'apollo-server-koa'

export const NewLocation = gql`
  input NewLocation {
    warehouse: [String]!
    name: String!
    zone: String!
    section: String!
    unit: String!
    shelf: String!
    state: String!
    description: String
  }
`
