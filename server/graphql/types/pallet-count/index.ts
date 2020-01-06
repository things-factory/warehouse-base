import { PalletCount } from './pallet-count'
import { NewPalletCount } from './new-pallet-count'
import { PalletCountPatch } from './pallet-count-patch'
import { PalletCountList } from './pallet-count-list'

export const Mutation = `
  createPalletCount (
    palletCount: NewPalletCount!
  ): PalletCount

  updatePalletCount (
    name: String!
    patch: PalletCountPatch!
  ): PalletCount

  updateMultiplePalletCount (
    patches: [PalletCountPatch]!
  ): [PalletCount]

  deletePalletCount (
    name: String!
  ): Boolean

  deletePalletCounts (
    names: [String]!
  ): Boolean

  updatePalletCountSeq(
    printQty: Int!
  ): Pallet
`

export const Query = `
  palletCounts(filters: [Filter], pagination: Pagination, sortings: [Sorting]): PalletCountList
  palletCount(name: String!): PalletCount
`

export const Types = [PalletCount, NewPalletCount, PalletCountPatch, PalletCountList]
