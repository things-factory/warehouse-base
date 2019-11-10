import gql from 'graphql-tag'

export const MovementList = gql`
  type MovementList {
    items: [Movement]
    total: Int
  }
`
