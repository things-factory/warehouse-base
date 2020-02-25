import { createInventory } from './create-inventory'
import { deleteInventories } from './delete-inventories'
import { deleteInventory } from './delete-inventory'
import { inventoriesResolver } from './inventories'
import { inventoriesByProduct } from './inventories-by-product'
import { inventoryResolver } from './inventory'
import { inventoryProductGroupResolver } from './inventory-product-group'
import { updateInventory } from './update-inventory'
import { updateMultipleInventory } from './update-multiple-inventory'

export const Query = {
  ...inventoriesResolver,
  ...inventoryResolver,
  ...inventoriesByProduct,
  ...inventoryProductGroupResolver
}

export const Mutation = {
  ...updateInventory,
  ...createInventory,
  ...deleteInventory,
  ...updateMultipleInventory,
  ...deleteInventories
}
