import gql from 'graphql-tag'

export const InventoryHistorySummary = gql`
  type InventoryHistorySummary {
    batchId: String
    packingType: String
    product: Product
    openingQty: Float
    adjustmentQty: Float
    closingQty: Float
    totalInQty: Float
    totalOutQty: Float
    initialQty: Float
    initialDate: String
  }
`
