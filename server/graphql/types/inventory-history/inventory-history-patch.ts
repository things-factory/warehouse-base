import { gql } from 'apollo-server-koa'

export const InventoryHistoryPatch = gql`
  input InventoryHistoryPatch {
    seq: Int
    name: String
    bizplace: ObjectRef
    palletId: String
    batchId: String
    productId: String
    productName: String
    locationId: String
    locationName: String
    warehouseId: String
    warehouseName: String
    zone: String
    packingType: String
    qty: Int
    status: String
    transactionType: String
    description: String
    cuFlag: String
    fromDate: String
    toDate: String
  }
`
