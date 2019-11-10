import gql from 'graphql-tag'

export const InventoryHistoryList = gql`
  type InventoryHistoryList {
    items: [InventoryHistory]
    total: Int
  }
`
