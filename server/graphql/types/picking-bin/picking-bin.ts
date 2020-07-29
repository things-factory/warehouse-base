import gql from 'graphql-tag'

export const PickingBin = gql`
  type PickingBin {
    id: String
    name: String
    domain: Domain
    description: String
    status: String
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`
