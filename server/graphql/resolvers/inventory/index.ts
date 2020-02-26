import { createInventory } from './create-inventory'
import { deleteInventories } from './delete-inventories'
import { deleteInventory } from './delete-inventory'
import { inventoriesResolver } from './inventories'
import { inventoriesByProduct } from './inventories-by-product'
import { inventoryResolver } from './inventory'
import { updateInventory } from './update-inventory'
import { updateMultipleInventory } from './update-multiple-inventory'
import { generatePalletIdResolver } from './generate-pallet-id'

export const Query = {
  ...inventoriesResolver,
  ...inventoryResolver,
  ...inventoriesByProduct,
  ...generatePalletIdResolver
}

export const Mutation = {
  ...updateInventory,
  ...createInventory,
  ...deleteInventory,
  ...updateMultipleInventory,
  ...deleteInventories
}
