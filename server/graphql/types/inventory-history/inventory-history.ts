import gql from 'graphql-tag'

export const InventoryHistory = gql`
  type InventoryHistory {
    id: String
    domain: Domain
    bizplace: Bizplace
    seq: Int
    name: String
    palletId: String
    batchId: String
    productId: String
    product: Product
    reusablePalletId: String
    reusablePallet: Pallet
    locationId: String
    location: Location
    warehouseId: String
    warehouse: Warehouse
    weight: Float
    openingWeight: Float
    zone: String
    packingType: String
    otherRef: String
    qty: Float
    openingQty: Float
    unit: String
    status: String
    transactionType: String
    description: String
    transactionFlow: String
    orderName: String
    orderRefNo: String
    orderNo: String
    refOrderId: String
    creator: User
    updater: User
    createdAt: String
    updatedAt: String
    openingBalance: Float
    inBalance: Float
    outBalance: Float
    closingBalance: Float
    arrivalNoticeName: String
    jsonDateMovement: String
    containerSize: String
  }
`
