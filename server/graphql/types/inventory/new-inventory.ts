import { gql } from 'apollo-server-koa'

export const NewInventory = gql`
  input NewInventory {
    name: String
    palletId: String
    batchId: String
    productId: String
    location: ObjectRef
    movements: [ObjectRef]
    startQty: Int
    qty: Int
    endQty: Int
    status: String
    description: String
  }
`
