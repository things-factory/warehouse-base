import gql from 'graphql-tag'

export const DockPatch = gql`
  input DockPatch {
    id: String
    name: String
    description: String
    type: String
    status: String
    warehouse: ObjectRef
    cuFlag: String
  }
`
