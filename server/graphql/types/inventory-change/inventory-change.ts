import gql from 'graphql-tag'

export const InventoryChange = gql`
  type InventoryChange {
    id: String
    domain: Domain
    bizplace: Bizplace
    inventory: Inventory
    name: String
    palletId: String
    batchId: String
    product: Product
    location: Location
    warehouse: Warehouse
    zone: String
    packingType: String
    qty: Int
    weight: Float
    unit: String
    status: String
    description: String
    creator: User
    updater: User
    createdAt: String
    updatedAt: String
  }
`
