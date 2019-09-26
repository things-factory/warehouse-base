import { gql } from 'apollo-server-koa'

export const InventoryPatch = gql`
  input InventoryPatch {
    id: String
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
