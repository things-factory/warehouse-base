import gql from 'graphql-tag'

export const InventoryProductGroupList = gql`
  type InventoryProductGroupList {
    items: [InventoryProductGroup]
    total: Int
  }
`
