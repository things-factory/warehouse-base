import gql from 'graphql-tag'

export const InventoryChange = gql`
  type InventoryChange {
    id: String
    domain: Domain
    name: String
    palletId: String
    inventory: Inventory
    batchId: String
    bizplace: Bizplace
    product: Product
    location: Location
    packingType: String
    qty: Int
    weight: Float
    uom: String
    uomValue: Float
    status: String
    transactionType: String
    lastInventoryHistory: InventoryHistory
    creator: User
    updater: User
    createdAt: String
    updatedAt: String
  }
`
