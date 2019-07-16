import { gql } from 'apollo-server-koa'

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
