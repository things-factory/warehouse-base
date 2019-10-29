import { gql } from 'apollo-server-koa'

export const NewInventory = gql`
  input NewInventory {
    name: String
    refInventory: ObjectRef
    palletId: String
    batchId: String
    product: ObjectRef
    location: ObjectRef
    warehouse: ObjectRef
    packingType: String
    qty: Int
    weight: Float
    unit: String
    status: String
    description: String
  }
`
