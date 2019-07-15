import { gql } from 'apollo-server-koa'

export const MovementList = gql`
  type MovementList {
    items: [Movement]
    total: Int
  }
`
