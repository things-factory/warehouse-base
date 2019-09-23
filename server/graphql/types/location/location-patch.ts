import { gql } from 'apollo-server-koa'

export const LocationPatch = gql`
  input LocationPatch {
    id: String
    warehouse: ObjectRef
    name: String
    description: String
    type: String
    zone: String
    row: String
    column: String
    shelf: String
    status: String
    cuFlag: String
  }
`
