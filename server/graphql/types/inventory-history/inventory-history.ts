import { gql } from 'apollo-server-koa'

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
    locationId: String
    location: Location
    warehouseId: String
    warehouse: Warehouse
    weight: Float
    openingWeight: Float
    zone: String
    packingType: String
    qty: Float
    openingQty: Float
    unit: String
    status: String
    transactionType: String
    description: String
    transactionFlow: String
    orderName: String
    orderRefNo: String
    creator: User
    updater: User
    createdAt: String
    updatedAt: String
  }
`
