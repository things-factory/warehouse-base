import gql from 'graphql-tag'

export const NewMovement = gql`
  input NewMovement {
    id: String
    bizplace: ObjectRef
    inventory: ObjectRef
    inQty: Int!
    outQty: Int!
    description: String
  }
`
