import { InventoryChange } from './inventory-change'
import { NewInventoryChange } from './new-inventory-change'
import { InventoryChangePatch } from './inventory-change-patch'
import { InventoryChangeList } from './inventory-change-list'

export const Mutation = `
  createInventoryChange (
    inventoryChange: NewInventoryChange!
  ): InventoryChange

  updateInventoryChange (
    name: String!
    patch: InventoryChangePatch!
  ): InventoryChange
  

  updateMultipleInventoryChange (
    patches: [InventoryChangePatch]!
  ): [InventoryChange]

  deleteInventoryChange (
    name: String!
  ): Boolean

  deleteInventoryChanges (
    names: [String]!
  ): Boolean
  
  submitInventoryChanges (
    patches: [InventoryPatch]!
  ): Boolean @priviledge(category: "inventory", priviledge: "mutation")
  
  approveInventoryChanges (
    patches: [InventoryChangePatch]!
  ): Boolean @priviledge(category: "inventory_adjustment_approval", priviledge: "mutation")
  
  rejectInventoryChanges (
    patches: [InventoryChangePatch]!
  ): Boolean @priviledge(category: "inventory_adjustment_approval", priviledge: "mutation")
`

export const Query = `
  inventoryChanges(filters: [Filter], pagination: Pagination, sortings: [Sorting]): InventoryChangeList
  inventoryChange(name: String!): InventoryChange
`

export const Types = [InventoryChange, NewInventoryChange, InventoryChangePatch, InventoryChangeList]
