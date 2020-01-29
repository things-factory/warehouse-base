import gql from 'graphql-tag'

export const NewPallet = gql`
  input NewPallet {
    name: String!
    seq: Int
    owner: ObjectRef
    holder: ObjectRef
    status: String
  }
`
