import { createWarehouse, createWarehouseResolver } from './create-warehouse'
import { deleteWarehouse } from './delete-warehouse'
import { deleteWarehouses, deleteWarehousesResolver } from './delete-warehouses'
import { updateMultipleWarehouse } from './update-multiple-warehouse'
import { updateWarehouse } from './update-warehouse'
import { warehouseResolver } from './warehouse'
import { warehousesResolver } from './warehouses'

export const Query = {
  ...warehousesResolver,
  ...warehouseResolver
}

export const Mutation = {
  ...updateWarehouse,
  ...createWarehouseResolver,
  ...deleteWarehouse,
  ...deleteWarehousesResolver,
  ...updateMultipleWarehouse
}

export { createWarehouse, updateWarehouse, deleteWarehouses, deleteWarehouse }
