import gql from 'graphql-tag'

export const Location = gql`
  type Location {
    id: String
    domain: Domain
    warehouse: Warehouse
    name: String
    description: String
    type: String
    zone: String
    row: String
    column: String
    shelf: String
    status: String
    creator: User
    updater: User
    createdAt: String
    updatedAt: String
  }
`
