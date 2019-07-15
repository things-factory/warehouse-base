import { Filter, Pagination, Sorting } from '@things-factory/shell'
import { Inventory } from './inventory'
import { InventoryList } from './inventory-list'
import { InventoryPatch } from './inventory-patch'
import { NewInventory } from './new-inventory'

export const Mutation = `
  createInventory (
    inventory: NewInventory!
  ): Inventory

  updateInventory (
    name: String!
    patch: InventoryPatch!
  ): Inventory

  deleteInventory (
    name: String!
  ): Inventory
`

export const Query = `
  inventories(filters: [Filter], pagination: Pagination, sortings: [Sorting]): InventoryList
  inventory(name: String!): Inventory
`

export const Types = [Filter, Pagination, Sorting, Inventory, NewInventory, InventoryPatch, InventoryList]
