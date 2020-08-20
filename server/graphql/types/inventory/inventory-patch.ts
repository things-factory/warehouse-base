import gql from 'graphql-tag'

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
    reusablePallet: ObjectRef
    reusablePalletId: String
    location: ObjectRef
    locationName: String
    warehouse: ObjectRef
    warehouseName: String
    packingType: String
    otherRef: String
    zone: String
    weight: Float
    unit: String
    qty: Int
    status: String
    description: String
    updatedAt: String
    updater: String
    cuFlag: String
  }
`
