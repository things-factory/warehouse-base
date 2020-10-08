import { createInventoryHistory } from './create-inventory-history'
import { deleteInventoryHistories } from './delete-inventory-histories'
import { deleteInventoryHistory } from './delete-inventory-history'
import { inventoryHistoriesResolver } from './inventory-histories'
import { inventoryHistoryResolver } from './inventory-history'
import { updateInventoryHistory } from './update-inventory-history'
import { updateMultipleInventoryHistory } from './update-multiple-inventory-history'
import { bizplaceInventoryHistories } from './bizplace-inventory-histories'
import { warehouseInventoryHistories } from './warehouse-inventory-histories'
import { inventoryHistoryReport } from './inventory-history-report'
import { inventoryHistoryPalletReport } from './inventory-history-pallet-report'
import { inventoryHistoryPalletDetailReport } from './inventory-history-pallet-detail-report'
import { inventoryHistoryPalletStorageReport } from './inventory-history-pallet-storage-report'
import { inventoryHistorySummaryReport } from './inventory-history-summary-report'
import { onhandInventoriesResolver } from './onhand-inventories'

export const Query = {
  ...inventoryHistoriesResolver,
  ...inventoryHistoryResolver,
  ...bizplaceInventoryHistories,
  ...inventoryHistoryReport,
  ...warehouseInventoryHistories,
  ...inventoryHistoryPalletReport,
  ...inventoryHistoryPalletDetailReport,
  ...inventoryHistoryPalletStorageReport,
  ...inventoryHistorySummaryReport,
  ...onhandInventoriesResolver
}

export const Mutation = {
  ...updateInventoryHistory,
  ...updateMultipleInventoryHistory,
  ...createInventoryHistory,
  ...deleteInventoryHistory,
  ...deleteInventoryHistories
}
