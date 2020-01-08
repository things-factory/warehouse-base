import { Pallet } from './pallet'
import { NewPallet } from './new-pallet'
import { PalletPatch } from './pallet-patch'
import { PalletList } from './pallet-list'

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

  updatePalletSeq(
    printQty: Int!
  ): Pallet
`

export const Query = `
  pallets(filters: [Filter], pagination: Pagination, sortings: [Sorting]): PalletList
  pallet(name: String!): Pallet
`

export const Types = [Pallet, NewPallet, PalletPatch, PalletList]
