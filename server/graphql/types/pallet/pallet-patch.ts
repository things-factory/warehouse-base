import { gql } from 'apollo-server-koa'

export const PalletPatch = gql`
  input PalletPatch {
    id: String
    name: String
    seq: Int
    cuFlag: String
  }
`
