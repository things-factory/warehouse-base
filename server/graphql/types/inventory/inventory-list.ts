import gql from 'graphql-tag'

export const InventoryList = gql`
  type InventoryList {
    items: [Inventory]
    total: Int
  }
`
