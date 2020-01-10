import gql from 'graphql-tag'

export const PalletHistoryList = gql`
  type PalletHistoryList {
    items: [PalletHistory]
    total: Int
  }
`
