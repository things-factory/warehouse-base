import gql from 'graphql-tag'

export const NewLocation = gql`
  input NewLocation {
    warehouse: ObjectRef!
    name: String!
    description: String
    type: String
    zone: String!
    row: String!
    column: String!
    shelf: String!
    status: String!
  }
`
