import gql from 'graphql-tag'

export const InventoryHistoryPatch = gql`
  input InventoryHistoryPatch {
    seq: Int
    name: String
    bizplace: ObjectRef
    orderRefNo: String
    orderNo: String
    palletId: String
    batchId: String
    productId: String
    productName: String
    reusablePalletId: String
    reusablePalletName: String
    locationId: String
    locationName: String
    warehouseId: String
    warehouseName: String
    otherRef: String
    zone: String
    packingType: String
    weight: Float
    qty: Int
    uom: String
    uomValue: Float
    status: String
    transactionType: String
    description: String
    cuFlag: String
    fromDate: String
    toDate: String
  }
`
