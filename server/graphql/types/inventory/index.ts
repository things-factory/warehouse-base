import { Inventory } from './inventory'
import { NewInventory } from './new-inventory'
import { InventoryPatch } from './inventory-patch'

export const Mutation = `
  createInventory (
    inventory: NewInventory!
  ): Inventory

  updateInventory (
    id: String!
    patch: InventoryPatch!
  ): Inventory

  deleteInventory (
    id: String!
  ): Inventory

  publishInventory (
    id: String!
  ): Inventory
`

export const Query = `
  inventories: [Inventory]
  inventory(id: String!): Inventory
`

export const Types = [Inventory, NewInventory, InventoryPatch]
