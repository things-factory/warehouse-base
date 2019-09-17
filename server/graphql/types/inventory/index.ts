import { Inventory } from './inventory'
import { InventoryList } from './inventory-list'
import { InventoryPatch } from './inventory-patch'
import { NewInventory } from './new-inventory'

export const Mutation = `
  createInventory (
    inventory: NewInventory!
  ): Inventory @priviledge(category: "warehouse", priviledge: "mutation")

  updateInventory (
    name: String!
    patch: InventoryPatch!
  ): Inventory @priviledge(category: "warehouse", priviledge: "mutation")

  deleteInventory (
    name: String!
  ): Boolean @priviledge(category: "warehouse", priviledge: "mutation")
    `

export const Query = `
inventories(filters: [Filter], pagination: Pagination, sortings: [Sorting]): InventoryList @priviledge(category: "warehouse", priviledge: "query")
inventory(id: String!): Inventory @priviledge(category: "warehouse", priviledge: "query")
`

export const Types = [Inventory, NewInventory, InventoryPatch, InventoryList]
