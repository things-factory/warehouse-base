import { gql } from 'apollo-server-koa'

export const NewWarehouse = gql`
  input NewWarehouse {
    id: String
    name: String!
    bizplace: ObjectRef
    locations: [ObjectRef]
    description: String
  }
`
