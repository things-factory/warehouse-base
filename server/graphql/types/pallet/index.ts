import { Pallet } from './pallet'
import { NewPallet } from './new-pallet'
import { PalletPatch } from './pallet-patch'
import { PalletList } from './pallet-list'
import { PalletValidate } from './pallet-validate'

export const Mutation = `
  createPallet (
    pallet: NewPallet!
  ): Pallet

  updatePallet (
    name: String!
    patch: PalletPatch!
  ): Pallet

  updateMultiplePallet (
    patches: [PalletPatch]!
  ): [Pallet]

  deletePallet (
    id: String!
  ): Boolean

  deletePallets (
    id: [String]!
  ): Boolean

  palletReturn (
    patches: [PalletPatch]!
  ): [Pallet]

`

export const Query = `
  pallets(filters: [Filter], pagination: Pagination, sortings: [Sorting]): PalletList
  pallet(name: String!): Pallet
  palletInboundValidate(name: String!): PalletValidate
  palletOutboundValidate(name: String!): PalletValidate
`

export const Types = [Pallet, NewPallet, PalletPatch, PalletList, PalletValidate]
