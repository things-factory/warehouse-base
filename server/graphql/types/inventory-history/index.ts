import { InventoryHistory } from './inventory-history'
import { InventoryHistoryList } from './inventory-history-list'
import { InventoryHistoryPatch } from './inventory-history-patch'
import { NewInventoryHistory } from './new-inventory-history'
import { InventoryHistorySummary } from './inventory-history-summary'
import { InventoryHistorySummaryList } from './inventory-history-summary-list'
import { InventoryHistoryPalletReport } from './inventory-history-pallet-report'
import { InventoryHistoryPalletReportList } from './inventory-history-pallet-report-list'

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
  bizplaceInventoryHistories(inventoryHistory: InventoryHistoryPatch, filters: [Filter], pagination: Pagination, sortings: [Sorting]): InventoryHistoryList
  warehouseInventoryHistories(inventoryHistory: InventoryHistoryPatch, filters: [Filter], pagination: Pagination, sortings: [Sorting]): InventoryHistoryList
  inventoryHistoryReport(filters: [Filter], pagination: Pagination, sortings: [Sorting]): [InventoryHistory]
  inventoryHistoryPalletReport(filters: [Filter], pagination: Pagination, sortings: [Sorting]): [InventoryHistory]
  inventoryHistoryPalletDetailReport(filters: [Filter], pagination: Pagination, sortings: [Sorting]): [InventoryHistory]
  inventoryHistoryPalletStorageReport(filters: [Filter], pagination: Pagination, sortings: [Sorting]): InventoryHistoryPalletReportList
  inventoryHistorySummaryReport(filters: [Filter], pagination: Pagination, sortings: [Sorting]): InventoryHistorySummaryList
`

export const Types = [
  InventoryHistory,
  NewInventoryHistory,
  InventoryHistoryPatch,
  InventoryHistoryList,
  InventoryHistorySummary,
  InventoryHistorySummaryList,
  InventoryHistoryPalletReport,
  InventoryHistoryPalletReportList
]
