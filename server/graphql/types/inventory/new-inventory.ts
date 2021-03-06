import gql from 'graphql-tag'

export const NewInventory = gql`
  input NewInventory {
    name: String
    refInventory: ObjectRef
    palletId: String
    batchId: String
    product: ObjectRef
    reusablePallet: ObjectRef
    location: ObjectRef
    warehouse: ObjectRef
    packingType: String
    otherRef: String
    qty: Int
    weight: Float
    uom: String
    uomValue: Float
    status: String
    description: String
    remark: String
  }
`
