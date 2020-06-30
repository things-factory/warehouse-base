import gql from 'graphql-tag'

export const Pallet = gql`
  type Pallet {
    id: String
    name: String
    seq: Int
    owner: Bizplace
    holder: Bizplace
    inventory: Inventory
    status: String
    domain: Domain
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`
