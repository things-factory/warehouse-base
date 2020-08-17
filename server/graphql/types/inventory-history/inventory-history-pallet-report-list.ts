import gql from 'graphql-tag'

export const InventoryHistoryPalletReportList = gql`
  type InventoryHistoryPalletReportList {
    items: [InventoryHistory]
    totalLocationStored: Int
    totalLocationInbound: Int
    total: Int
  }
`
