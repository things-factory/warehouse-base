import { gql } from 'apollo-server-koa'

export const LocationPatch = gql`
  input LocationPatch {
    warehouse: [String]
    name: String
    zone: String
    section: String
    unit: String
    shelf: String
    state: String
    description: String
  }
`
