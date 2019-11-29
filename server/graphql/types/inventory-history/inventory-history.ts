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
    locationId: String
    location: Location
    warehouseId: String
    warehouse: Warehouse
    weight: Float
    zone: String
    packingType: String
    qty: Int
    unit: String
    status: String
    transactionType: String
    description: String
    transactionFlow: String
    creator: User
    updater: User
    createdAt: String
    updatedAt: String
  }
`
