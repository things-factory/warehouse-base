import gql from 'graphql-tag'

export const PalletCount = gql`
  type PalletCount {
    id: String
    name: String
    domain: Domain
    description: String
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`
