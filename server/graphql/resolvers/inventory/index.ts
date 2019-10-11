import { createInventory } from './create-inventory'
import { deleteInventory } from './delete-inventory'
import { intransitInventories } from './intransit-inventories'
import { inventoriesResolver } from './inventories'
import { inventoryResolver } from './inventory'
import { onhandInventories } from './onhand-inventories'
import { updateInventory } from './update-inventory'
import { updateMultipleInventory } from './update-multiple-inventory'
import { deleteInventories } from './delete-inventories'

export const Query = {
  ...inventoriesResolver,
  ...inventoryResolver,
  ...onhandInventories,
  ...intransitInventories
}

export const Mutation = {
  ...updateInventory,
  ...createInventory,
  ...deleteInventory,
  ...updateMultipleInventory,
  ...deleteInventories
}
