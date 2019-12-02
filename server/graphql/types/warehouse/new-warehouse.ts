import gql from 'graphql-tag'

export const NewWarehouse = gql`
  input NewWarehouse {
    id: String
    name: String!
    locations: [ObjectRef]
    description: String
  }
`
