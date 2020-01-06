import gql from 'graphql-tag'

export const DockList = gql`
  type DockList {
    items: [Dock]
    total: Int
  }
`
