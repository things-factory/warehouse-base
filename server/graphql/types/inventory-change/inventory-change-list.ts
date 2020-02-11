import gql from 'graphql-tag'

export const InventoryChangeList = gql`
  type InventoryChangeList {
    items: [InventoryChange]
    total: Int
  }
`
