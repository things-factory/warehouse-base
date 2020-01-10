import { gql } from 'apollo-server-koa'

export const Pallet = gql`
  type Pallet {
    id: String
    name: String
    seq: Int
    owner: Bizplace
    holder: Bizplace
    status: String
    domain: Domain
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`
