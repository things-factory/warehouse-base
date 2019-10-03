import { createInventoryHistory } from './create-inventory-history'
import { deleteInventoryHistories } from './delete-inventory-histories'
import { deleteInventoryHistory } from './delete-inventory-history'
import { inventoryHistoriesResolver } from './inventory-histories'
import { inventoryHistoryResolver } from './inventory-history'
import { updateInventoryHistory } from './update-inventory-history'
import { updateMultipleInventoryHistory } from './update-multiple-inventory-history'
import { bizplaceInventoryHistories } from './bizplace-inventory-histories'

export const Query = {
  ...inventoryHistoriesResolver,
  ...inventoryHistoryResolver,
  ...bizplaceInventoryHistories
}

export const Mutation = {
  ...updateInventoryHistory,
  ...updateMultipleInventoryHistory,
  ...createInventoryHistory,
  ...deleteInventoryHistory,
  ...deleteInventoryHistories
}
