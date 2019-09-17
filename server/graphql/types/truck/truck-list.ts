import { gql } from 'apollo-server-koa'

export const TruckList = gql`
  type TruckList {
    items: [Truck]
    total: Int
  }
`
