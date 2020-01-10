import gql from 'graphql-tag'

export const PalletHistory = gql`
  type PalletHistory {
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
