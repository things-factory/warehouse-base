import { gql } from 'apollo-server-koa'

export const LocationList = gql`
  type LocationList {
    items: [Location]
    total: Int
  }
`
