import gql from 'graphql-tag'

export const Dock = gql`
  type Dock {
    id: String
    name: String
    domain: Domain
    description: String
    type: String
    status: String
    warehouse: Warehouse
    startedAt: String
    endedAt: String
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`
