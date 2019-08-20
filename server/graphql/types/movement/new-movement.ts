import { gql } from 'apollo-server-koa'

export const NewMovement = gql`
  input NewMovement {
    id: String
    date: String!
    warehouse: WarehousePatch!
    product: ProductPatch!
    startQty: Int!
    inQty: Int!
    outQty: Int!
    endQty: Int!
    description: String
  }
`
