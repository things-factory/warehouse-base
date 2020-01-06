import gql from 'graphql-tag'

export const ContainerPatch = gql`
  input ContainerPatch {
    name: String
    description: String
  }
`
