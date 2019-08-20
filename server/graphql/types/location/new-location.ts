import { gql } from 'apollo-server-koa'

export const NewLocation = gql`
  input NewLocation {
    warehouse: WarehousePatch!
    product: ProductPatch
    name: String!
    zone: String!
    row: String!
    column: String!
    shelf: String!
    status: String!
    description: String
  }
`
