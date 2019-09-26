import { gql } from 'apollo-server-koa'

export const InventoryHistoryList = gql`
  type InventoryHistoryList {
    items: [InventoryHistory]
    total: Int
  }
`
