import gql from 'graphql-tag'

export const InventoryProductGroup = gql`
  type InventoryProductGroup {
    productId: String
    batchId: String
    productName: String
    packingType: String
    remainQty: Float
    remainWeight: Float
    remainUomValue: Float
    remainUomValueWithUom: String
    uom: String
  }
`
