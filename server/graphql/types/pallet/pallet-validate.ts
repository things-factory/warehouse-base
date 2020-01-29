import gql from 'graphql-tag'

export const PalletValidate = gql`
  type PalletValidate {
    item: Pallet
    error: String
  }
`
