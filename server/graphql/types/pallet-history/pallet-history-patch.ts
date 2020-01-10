import gql from 'graphql-tag'

export const PalletHistoryPatch = gql`
  input PalletHistoryPatch {
    id: String
    name: String
    description: String
    cuFlag: String
  }
`
