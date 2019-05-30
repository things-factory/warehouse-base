import { gql } from 'apollo-server-koa'

export const Location = gql`
  type Location {
    id: String
    name: String
    domain: Domain
    description: String
  }
`
