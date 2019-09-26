import { gql } from 'apollo-server-koa'

export const NewInventoryHistory = gql`
  input NewInventoryHistory {
    seq: Int
    name: String
    palletId: String
    batchId: String
    product: ObjectRef
    location: ObjectRef
    qty: Int
    status: String
    description: String
    cuFlag: String
  }
`
