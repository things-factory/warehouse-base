import { gql } from 'apollo-server-koa'

export const WarehousePatch = gql`
  input WarehousePatch {
    name: String
    locations: [String]
    description: String
  }
`
