import { gql } from 'apollo-server-koa'

export const WarehouseList = gql`
  type WarehouseList {
    items: [Warehouse]
    total: Int
  }
`
