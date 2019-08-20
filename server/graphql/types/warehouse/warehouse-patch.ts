import { gql } from 'apollo-server-koa'

export const WarehousePatch = gql`
  input WarehousePatch {
    id: String
    name: String
    bizplace: BizplacePatch
    locations: [LocationPatch]
    description: String
  }
`
