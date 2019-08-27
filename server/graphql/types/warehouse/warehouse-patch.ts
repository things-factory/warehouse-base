import { gql } from 'apollo-server-koa'

export const WarehousePatch = gql`
  input WarehousePatch {
    id: String
    name: String
    type: String
    bizplace: ObjectRef
    locations: [ObjectRef]
    description: String
    cuFlag: String
  }
`
