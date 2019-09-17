import { gql } from 'apollo-server-koa'

export const NewInventory = gql`
  input NewInventory {
    id: String
    name: String!
    product: ObjectRef
    locations: [ObjectRef]
    movements: [ObjectRef]
    startQty: Int!
    endQty: Int!
    description: String
    status: String
  }
`
