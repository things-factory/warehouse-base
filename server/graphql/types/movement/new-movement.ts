import { gql } from 'apollo-server-koa'

export const NewMovement = gql`
  input NewMovement {
    name: String!
    description: String
  }
`
