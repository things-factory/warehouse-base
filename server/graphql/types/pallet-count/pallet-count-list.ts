import gql from 'graphql-tag'

export const PalletCountList = gql`
  type PalletCountList {
    items: [PalletCount]
    total: Int
  }
`
