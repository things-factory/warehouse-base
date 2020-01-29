import gql from 'graphql-tag'

export const PalletPatch = gql`
  input PalletPatch {
    id: String
    name: String
    seq: Int
    owner: ObjectRef
    holder: ObjectRef
    status: String
    cuFlag: String
  }
`
