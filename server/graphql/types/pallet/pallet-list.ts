import { gql } from 'apollo-server-koa'

export const PalletList = gql`
  type PalletList {
    items: [Pallet]
    total: Int
  }
`
