import { gql } from 'apollo-server-koa'

export const MovementPatch = gql`
  input MovementPatch {
    name: String
    description: String
  }
`
