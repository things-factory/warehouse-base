import { gql } from 'apollo-server-koa'

export const Movement = gql`
  type Movement {
    id: String
    name: String
    domain: Domain
    description: String
  }
`
