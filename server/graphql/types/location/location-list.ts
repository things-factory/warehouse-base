import gql from 'graphql-tag'

export const LocationList = gql`
  type LocationList {
    items: [Location]
    total: Int
  }
`
