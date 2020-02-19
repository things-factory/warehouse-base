import gql from 'graphql-tag'

export const LocationOccupancy = gql`
  type LocationOccupancy {
    total: Int
    occupied: Int
    empty: Int
    percentage: Int
  }
`
