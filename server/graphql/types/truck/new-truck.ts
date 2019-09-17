import { gql } from 'apollo-server-koa'

export const NewTruck = gql`
  input NewTruck {
    name: String!
    description: String
  }
`
