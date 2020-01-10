import { PalletHistory } from './pallet-history'
import { NewPalletHistory } from './new-pallet-history'
import { PalletHistoryPatch } from './pallet-history-patch'
import { PalletHistoryList } from './pallet-history-list'

export const Mutation = `
  createPalletHistory (
    palletHistory: NewPalletHistory!
  ): PalletHistory

  updatePalletHistory (
    name: String!
    patch: PalletHistoryPatch!
  ): PalletHistory

  updateMultiplePalletHistory (
    patches: [PalletHistoryPatch]!
  ): [PalletHistory]

  deletePalletHistory (
    name: String!
  ): Boolean

  deletePalletHistories (
    names: [String]!
  ): Boolean
`

export const Query = `
  palletHistories(filters: [Filter], pagination: Pagination, sortings: [Sorting]): PalletHistoryList
  palletHistory(name: String!): PalletHistory
`

export const Types = [PalletHistory, NewPalletHistory, PalletHistoryPatch, PalletHistoryList]
