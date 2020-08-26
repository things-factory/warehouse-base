import gql from 'graphql-tag'

export const InventoryHistoryPalletReportList = gql`
  type InventoryHistoryPalletReportList {
    items: [InventoryHistoryPalletReport]
    total: Int
    totalWithOpeningBalance: Int
  }
`
