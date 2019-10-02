import { gql } from 'apollo-server-koa'

export const InventoryPatch = gql`
  input InventoryPatch {
    id: String
    name: String
    bizplace: ObjectRef
    refInventory: ObjectRef
    bizplaceName: String
    palletId: String
    batchId: String
    product: ObjectRef
    productName: String
    location: ObjectRef
    locationName: String
    warehouse: ObjectRef
    warehouseName: String
    packingType: String
    zone: String
    qty: Int
    status: String
    description: String
  }
`
