import { gql } from 'apollo-server-koa'

export const MovementPatch = gql`
  input MovementPatch {
    date: String
    warehouse: String
    bizplace: String
    product: String
    startQty: Int
    inQty: Int
    outQty: Int
    endQty: Int
    description: String
  }
`
