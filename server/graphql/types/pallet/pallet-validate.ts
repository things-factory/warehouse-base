import { gql } from 'apollo-server-koa'

export const PalletValidate = gql`
  type PalletValidate {
    item: Pallet
    error: String
  }
`
