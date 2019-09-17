import { gql } from 'apollo-server-koa'

export const MovementPatch = gql`
  input MovementPatch {
    id: String
    bizplace: ObjectRef
    inventory: ObjectRef
    inQty: Int
    outQty: Int
    description: String
  }
`
