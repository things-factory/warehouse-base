import { Inventory } from './inventory'
import { InventoryList } from './inventory-list'
import { InventoryPatch } from './inventory-patch'
import { InventoryProductGroup } from './inventory-product-group'
import { InventoryProductGroupList } from './inventory-product-group-list'
import { NewInventory } from './new-inventory'

export const Mutation = `
  createInventory (
    inventory: NewInventory!
  ): Inventory @priviledge(category: "inventory", priviledge: "mutation")

  updateInventory (
    name: String!
    patch: InventoryPatch!
  ): Inventory @priviledge(category: "inventory", priviledge: "mutation")

  deleteInventory (
    name: String!
  ): Boolean @priviledge(category: "inventory", priviledge: "mutation")
  
  updateMultipleInventory (
    patches: [InventoryPatch]!
  ): [Inventory] @priviledge(category: "inventory", priviledge: "mutation")

  deleteInventories (
    id: [String]!
  ): Boolean @priviledge(category: "inventory", priviledge: "mutation")
`

export const Query = `
  inventories(filters: [Filter], pagination: Pagination, sortings: [Sorting], locationSortingRules: [Sorting]): InventoryList @priviledge(category: "inventory", priviledge: "query")
  inventory(id: String!): Inventory @priviledge(category: "inventory", priviledge: "query")
  inventoriesByProduct(filters: [Filter], pagination: Pagination, sortings: [Sorting]): InventoryList @priviledge(category: "inventory", priviledge: "query")
  inventoryProductGroup(filters: [Filter], pagination: Pagination, sortings: [Sorting], locationSortingRules: [Sorting]): InventoryProductGroupList @priviledge(category: "inventory", priviledge: "query")
  inventoriesByStrategy(batchId: String!, productName: String!, packingType: String!, pickingStrategy: String!): InventoryList
`

export const Types = [
  Inventory,
  NewInventory,
  InventoryPatch,
  InventoryList,
  InventoryProductGroup,
  InventoryProductGroupList
]
