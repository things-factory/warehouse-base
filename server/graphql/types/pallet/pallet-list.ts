import gql from 'graphql-tag'

export const PalletList = gql`
  type PalletList {
    items: [Pallet]
    total: Int
  }
`
