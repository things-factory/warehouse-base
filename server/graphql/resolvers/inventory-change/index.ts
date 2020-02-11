import { inventoryChangeResolver } from './inventory-change'
import { inventoryChangesResolver } from './inventory-changes'

import { updateInventoryChange } from './update-inventory-change'
import { updateMultipleInventoryChange } from './update-multiple-inventory-change'
import { createInventoryChange } from './create-inventory-change'
import { deleteInventoryChange } from './delete-inventory-change'
import { deleteInventoryChanges } from './delete-inventory-changes'
import { submitInventoryChanges } from './submit-inventory-changes'

export const Query = {
  ...inventoryChangesResolver,
  ...inventoryChangeResolver
}

export const Mutation = {
  ...updateInventoryChange,
  ...updateMultipleInventoryChange,
  ...createInventoryChange,
  ...deleteInventoryChange,
  ...deleteInventoryChanges,
  ...submitInventoryChanges
}
