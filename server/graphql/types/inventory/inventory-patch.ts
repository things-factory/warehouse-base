import { gql } from 'apollo-server-koa'

export const InventoryPatch = gql`
  input InventoryPatch {
    id: String
    name: String
    productId: String
    location: ObjectRef
    movements: [ObjectRef]
    startQty: Int
    endQty: Int
    description: String
    status: String
  }
`
