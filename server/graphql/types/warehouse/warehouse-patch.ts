import gql from 'graphql-tag'

export const WarehousePatch = gql`
  input WarehousePatch {
    id: String
    name: String
    type: String
    locations: [ObjectRef]
    description: String
    cuFlag: String
  }
`
