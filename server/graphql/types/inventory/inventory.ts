import gql from 'graphql-tag'

export const Inventory = gql`
  type Inventory {
    id: String
    domain: Domain
    bizplace: Bizplace
    refInventory: Inventory
    name: String
    palletId: String
    batchId: String
    product: Product
    reusablePallet: Pallet
    location: Location
    warehouse: Warehouse
    zone: String
    packingType: String
    qty: Int
    remainQty: Int
    lockedQty: Int
    otherRef: String
    lastSeq: Int
    weight: Float
    remainWeight: Float
    stdUnit: String
    stdUnitValue: Float
    remainStdUnitValue: Float
    status: String
    description: String
    creator: User
    updater: User
    createdAt: String
    updatedAt: String
    initialInboundAt: String
  }
`
