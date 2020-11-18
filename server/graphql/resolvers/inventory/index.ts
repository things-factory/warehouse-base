import { checkProductIdenticalityResolver } from './check-product-identicality'
import { checkInventoryOwnerResolver } from './check-inventory-owner'
import { createInventory } from './create-inventory'
import { deleteInventories } from './delete-inventories'
import { deleteInventory } from './delete-inventory'
import { inventoriesResolver } from './inventories'
import { inventoriesByProduct } from './inventories-by-product'
import { inventoriesByStrategyResolver } from './inventories-by-strategy'
import { inventoryResolver } from './inventory'
import { inventoryByPalletResolver } from './inventory-by-pallet'
import { inventoryProductGroupResolver } from './inventory-product-group'
import { updateInventory } from './update-inventory'
import { updateMultipleInventory } from './update-multiple-inventory'
import { inventoryTransfer } from './inventory-transfer'

export const Query = {
  ...inventoriesResolver,
  ...inventoryResolver,
  ...inventoriesByProduct,
  ...inventoryProductGroupResolver,
  ...inventoriesByStrategyResolver,
  ...checkProductIdenticalityResolver,
  ...checkInventoryOwnerResolver,
  ...inventoryByPalletResolver
}

export const Mutation = {
  ...updateInventory,
  ...createInventory,
  ...deleteInventory,
  ...updateMultipleInventory,
  ...deleteInventories,
  ...inventoryTransfer
}
