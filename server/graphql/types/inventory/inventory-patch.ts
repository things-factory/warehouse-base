import { gql } from 'apollo-server-koa'

export const InventoryPatch = gql`
  input InventoryPatch {
    id: String
    name: String
    palletId: String
    batchId: String
    product: ObjectRef
    location: ObjectRef
    warehouse: ObjectRef
    packingType: String
    qty: Int
    status: String
    description: String
  }
`
