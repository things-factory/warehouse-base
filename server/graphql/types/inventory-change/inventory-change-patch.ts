import gql from 'graphql-tag'

export const InventoryChangePatch = gql`
  input InventoryChangePatch {
    id: String
    name: String
    description: String
    cuFlag: String
  }
`
