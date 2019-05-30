import { gql } from 'apollo-server-koa'

export const NewLocation = gql`
  input NewLocation {
    name: String!
    description: String
  }
`
