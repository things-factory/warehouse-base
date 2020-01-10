import gql from 'graphql-tag'

export const NewPalletHistory = gql`
  input NewPalletHistory {
    name: String!
    description: String
  }
`
