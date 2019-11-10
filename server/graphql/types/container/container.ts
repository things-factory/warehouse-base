import gql from 'graphql-tag'

export const Container = gql`
  type Container {
    id: String
    domain: Domain
    name: String
    description: String
    creator: User
    updater: User
    createdAt: String
    updatedAt: String
  }
`
