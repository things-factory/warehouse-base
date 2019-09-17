import { gql } from 'apollo-server-koa'

export const NewMovement = gql`
  input NewMovement {
    id: String
    bizplace: ObjectRef
    inventory: ObjectRef
    inQty: Int!
    outQty: Int!
    description: String
  }
`
