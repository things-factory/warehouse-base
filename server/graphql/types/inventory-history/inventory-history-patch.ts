import { gql } from 'apollo-server-koa'

export const InventoryHistoryPatch = gql`
  input InventoryHistoryPatch {
    seq: Int
    name: String
    palletId: String
    batchId: String
    productId: String
    locationId: String
    warehouseId: String
    zone: String
    packingType: String
    qty: Int
    status: String
    description: String
    cuFlag: String
  }
`
