import { gql } from 'apollo-server-koa'

export const ContainerPatch = gql`
  input ContainerPatch {
    name: String
    description: String
  }
`
