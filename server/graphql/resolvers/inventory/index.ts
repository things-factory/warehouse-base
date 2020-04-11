import { checkProductIdenticalityResolver } from './check-product-identicality'
import { createInventory } from './create-inventory'
import { deleteInventories } from './delete-inventories'
import { deleteInventory } from './delete-inventory'
import { generatePalletIdResolver } from './generate-pallet-id'
import { inventoriesResolver } from './inventories'
import { inventoriesByProduct } from './inventories-by-product'
import { inventoriesByStrategyResolver } from './inventories-by-strategy'
import { inventoryResolver } from './inventory'
import { inventoryProductGroupResolver } from './inventory-product-group'
import { updateInventory } from './update-inventory'
import { updateMultipleInventory } from './update-multiple-inventory'

export const Query = {
  ...inventoriesResolver,
  ...inventoryResolver,
  ...inventoriesByProduct,
  ...generatePalletIdResolver,
  ...inventoryProductGroupResolver,
  ...inventoriesByStrategyResolver,
  ...checkProductIdenticalityResolver
}

export const Mutation = {
  ...updateInventory,
  ...createInventory,
  ...deleteInventory,
  ...updateMultipleInventory,
  ...deleteInventories
}
