import { gql } from 'apollo-server-koa'

export const NewContainer = gql`
  input NewContainer {
    name: String!
    description: String
  }
`
