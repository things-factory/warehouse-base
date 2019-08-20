import { gql } from 'apollo-server-koa'

export const LocationPatch = gql`
  input LocationPatch {
    id: String
    warehouse: WarehousePatch
    product: ProductPatch
    name: String
    zone: String
    row: String
    column: String
    shelf: String
    status: String
    description: String
  }
`
