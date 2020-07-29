import gql from 'graphql-tag'

export const PickingBinList = gql`
  type PickingBinList {
    items: [PickingBin]
    total: Int
  }
`
