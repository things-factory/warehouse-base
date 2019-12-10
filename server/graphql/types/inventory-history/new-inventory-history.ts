import gql from 'graphql-tag'

export const NewInventoryHistory = gql`
  input NewInventoryHistory {
    seq: Int
    name: String
    palletId: String
    batchId: String
    productId: String
    locationId: String
    warehouseId: String
    otherRef: String
    zone: String
    packingType: String
    weight: Float
    unit: String
    qty: Int
    status: String
    transactionType: String
    description: String
  }
`
