import gql from 'graphql-tag'

export const InventoryProductGroup = gql`
  type InventoryProductGroup {
    batchId: String
    productType: String
    productName: String
    remainQty: Float
    remainWeight: Float
  }
`
