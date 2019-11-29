import { gql } from 'apollo-server-koa'

export const NewPallet = gql`
  input NewPallet {
    name: String!
    description: String
  }
`
