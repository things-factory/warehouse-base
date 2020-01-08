import { gql } from 'apollo-server-koa'

export const NewPallet = gql`
  input NewPallet {
    name: String!
    seq: Int
    owner: ObjectRef
    holder: ObjectRef
    status: String
  }
`
