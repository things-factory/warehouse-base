import gql from 'graphql-tag'

export const NewWarehouse = gql`
  input NewWarehouse {
    id: String
    name: String!
    bizplace: ObjectRef
    locations: [ObjectRef]
    description: String
  }
`
