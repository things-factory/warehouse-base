import gql from 'graphql-tag'

export const NewDock = gql`
  input NewDock {
    name: String
    type: String
    status: String
    warehouse: ObjectRef
    description: String
  }
`
