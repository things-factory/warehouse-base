import { gql } from 'apollo-server-koa'

export const NewInventory = gql`
  input NewInventory {
    id: String
    name: String!
    productId: String
    location: ObjectRef
    movements: [ObjectRef]
    startQty: Int!
    endQty: Int!
    description: String
    status: String
  }
`
