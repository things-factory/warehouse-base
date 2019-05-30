import { gql } from 'apollo-server-koa'

export const LocationPatch = gql`
  input LocationPatch {
    name: String
    description: String
  }
`
