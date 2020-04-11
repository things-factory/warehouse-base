import gql from 'graphql-tag'

export const MovementCount = gql`
  type MovementCount {
    date: String
    count: String
    week: String
    inbound: Int
    outbound: Int
  }
`
