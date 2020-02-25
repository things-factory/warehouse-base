import gql from 'graphql-tag'

export const InventoryProductGroup = gql`
  type InventoryProductGroup {
    batchId: String
    productName: String
    packingType: String
    remainQty: Float
    remainWeight: Float
  }
`
