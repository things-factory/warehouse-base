import { gql } from 'apollo-server-koa'

export const NewInventory = gql`
  input NewInventory {
    name: String
    palletId: String
    batchId: String
    product: ObjectRef
    location: ObjectRef
    movements: [ObjectRef]
    qty: Int
    status: String
    description: String
  }
`
