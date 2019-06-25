import { gql } from 'apollo-server-koa'

export const ContainerList = gql`
  type ContainerList {
    items: [Container]
    total: Int
  }
`
