import { gql } from 'apollo-server-koa'

export const Container = gql`
  type Container {
    id: String
    name: String
    domain: Domain
    description: String
  }
`
