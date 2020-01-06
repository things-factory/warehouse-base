import gql from 'graphql-tag'

export const PalletCountPatch = gql`
  input PalletCountPatch {
    id: String
    name: String
    description: String
    cuFlag: String
  }
`
