import { inventoryResolver } from './inventory'
import { inventoriesResolver } from './inventories'

import { updateInventory } from './update-inventory'
import { createInventory } from './create-inventory'
import { deleteInventory } from './delete-inventory'

export const Query = {
  ...inventoriesResolver,
  ...inventoryResolver
}

export const Mutation = {
  ...updateInventory,
  ...createInventory,
  ...deleteInventory
}
