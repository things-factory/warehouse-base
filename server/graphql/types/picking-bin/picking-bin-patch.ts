import gql from 'graphql-tag'

export const PickingBinPatch = gql`
  input PickingBinPatch {
    id: String
    name: String
    description: String
    status: String
    cuFlag: String
  }
`
