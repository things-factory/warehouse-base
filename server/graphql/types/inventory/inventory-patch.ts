import { gql } from 'apollo-server-koa'

export const InventoryPatch = gql`
  input InventoryPatch {
    id: String
    product: ProductPatch
    location: LocationPatch
    productBatch: ProductBatchPatch
    name: String
    qty: Int
    description: String
    status: String
  }
`
