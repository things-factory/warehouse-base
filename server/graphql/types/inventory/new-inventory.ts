import { gql } from 'apollo-server-koa'

export const NewInventory = gql`
  input NewInventory {
    name: String!
    product: ProductPatch
    location: LocationPatch
    qty: Int!
    description: String
    status: String
  }
`
