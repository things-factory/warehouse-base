import { PickingBin } from './picking-bin'
import { NewPickingBin } from './new-picking-bin'
import { PickingBinPatch } from './picking-bin-patch'
import { PickingBinList } from './picking-bin-list'

export const Mutation = `
  createPickingBin (
    pickingBin: NewPickingBin!
  ): PickingBin

  updatePickingBin (
    name: String!
    patch: PickingBinPatch!
  ): PickingBin

  updateMultiplePickingBin (
    patches: [PickingBinPatch]!
  ): [PickingBin]

  deletePickingBin (
    name: String!
  ): Boolean

  deletePickingBins (
    ids: [String]!
  ): Boolean
`

export const Query = `
  pickingBins(filters: [Filter], pagination: Pagination, sortings: [Sorting]): PickingBinList
  pickingBin(name: String!): PickingBin
`

export const Types = [PickingBin, NewPickingBin, PickingBinPatch, PickingBinList]
