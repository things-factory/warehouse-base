import gql from 'graphql-tag'

export const NewPalletCount = gql`
  input NewPalletCount {
    name: String!
    description: String
  }
`
