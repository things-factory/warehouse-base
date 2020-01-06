import gql from 'graphql-tag'

export const WarehouseList = gql`
  type WarehouseList {
    items: [Warehouse]
    total: Int
  }
`
