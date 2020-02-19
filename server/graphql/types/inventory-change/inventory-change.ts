import gql from 'graphql-tag'

export const InventoryChange = gql`
  type InventoryChange {
    id: String
    domain: Domain
    name: String
    palletId: String
    batchId: String
    bizplace: Bizplace
    inventory: Inventory
    product: Product
    location: Location
    oriBizplace: Bizplace
    oriInventory: Inventory
    oriProduct: Product
    oriLocation: Location
    packingType: String
    qty: Int
    weight: Float
    unit: String
    status: String
    creator: User
    updater: User
    createdAt: String
    updatedAt: String
  }
`
