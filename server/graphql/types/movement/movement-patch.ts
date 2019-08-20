import { gql } from 'apollo-server-koa'

export const MovementPatch = gql`
  input MovementPatch {
    id: String
    date: String
    warehouse: WarehousePatch
    product: ProductPatch
    startQty: Int
    inQty: Int
    outQty: Int
    endQty: Int
    description: String
  }
`
