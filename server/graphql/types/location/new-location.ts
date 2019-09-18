import { gql } from 'apollo-server-koa'

export const NewLocation = gql`
  input NewLocation {
    warehouse: ObjectRef!
    inventory: ObjectRef
    name: String!
    description: String
    type: String
    zone: String!
    row: String!
    column: String!
    shelf: String!
    status: String!
  }
`
