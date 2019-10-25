import { createInventory } from './create-inventory'
import { deleteInventory } from './delete-inventory'
import { inventoriesResolver } from './inventories'
import { inventoryResolver } from './inventory'
import { updateInventory } from './update-inventory'
import { updateMultipleInventory } from './update-multiple-inventory'
import { deleteInventories } from './delete-inventories'

export const Query = {
  ...inventoriesResolver,
  ...inventoryResolver
}

export const Mutation = {
  ...updateInventory,
  ...createInventory,
  ...deleteInventory,
  ...updateMultipleInventory,
  ...deleteInventories
}
