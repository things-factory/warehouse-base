import gql from 'graphql-tag'

export const InventoryHistoryPalletReport = gql`
  type InventoryHistoryPalletReport {
    bizplace: Bizplace
    location: Location
    palletId: String
    inboundPalletId: String
    inboundQty: Int
    totalQty: Int
  }
`
