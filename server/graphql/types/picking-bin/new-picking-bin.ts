import gql from 'graphql-tag'

export const NewPickingBin = gql`
  input NewPickingBin {
    name: String!
    description: String
    status: String!
  }
`
