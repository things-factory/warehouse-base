import gql from 'graphql-tag'

export const MovementCount = gql`
  type MovementCount {
    date: String
    count: String
    week: Int
    inbound: Int
    outbound: Int
  }
`
