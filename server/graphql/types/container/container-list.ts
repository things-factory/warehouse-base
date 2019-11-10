import gql from 'graphql-tag'

export const ContainerList = gql`
  type ContainerList {
    items: [Container]
    total: Int
  }
`
