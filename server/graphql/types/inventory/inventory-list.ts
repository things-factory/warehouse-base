import { gql } from 'apollo-server-koa'

export const InventoryList = gql`
  type InventoryList {
    items: [Inventory]
    total: Int
  }
`
