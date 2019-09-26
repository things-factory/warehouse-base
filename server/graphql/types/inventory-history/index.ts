import { InventoryHistory } from './inventory-history'
import { InventoryHistoryList } from './inventory-history-list'
import { InventoryHistoryPatch } from './inventory-history-patch'
import { NewInventoryHistory } from './new-inventory-history'

export const Mutation = `
  createInventoryHistory (
    inventoryHistory: NewInventoryHistory!
  ): InventoryHistory

  updateInventoryHistory (
    name: String!
    patch: InventoryHistoryPatch!
  ): InventoryHistory

  updateMultipleInventoryHistory (
    patches: [InventoryHistoryPatch]!
  ): [InventoryHistory]

  deleteInventoryHistory (
    name: String!
  ): Boolean

  deleteInventoryHistories (
    names: [String]!
  ): Boolean
`

export const Query = `
  inventoryHistories(filters: [Filter], pagination: Pagination, sortings: [Sorting]): InventoryHistoryList
  inventoryHistory(name: String!): InventoryHistory
`

export const Types = [InventoryHistory, NewInventoryHistory, InventoryHistoryPatch, InventoryHistoryList]
