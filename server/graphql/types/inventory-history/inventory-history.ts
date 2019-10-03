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
    zone: String
    packingType: String
    qty: Int
    status: String
    description: String
    creator: User
    updater: User
    createdAt: String
    updatedAt: String
  }
`
