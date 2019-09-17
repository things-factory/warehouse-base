import { gql } from 'apollo-server-koa'

export const TruckPatch = gql`
  input TruckPatch {
    id: String
    name: String
    description: String
    cuFlag: String
  }
`
