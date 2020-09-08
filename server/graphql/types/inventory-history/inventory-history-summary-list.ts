import gql from 'graphql-tag'

export const InventoryHistorySummaryList = gql`
  type InventoryHistorySummaryList {
    items: [InventoryHistorySummary]
    total: Int
    totalInboundQty: Int
    totalOpeningBal: Int
  }
`
