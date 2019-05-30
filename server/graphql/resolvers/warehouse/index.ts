import { warehouseResolver } from './warehouse'
import { warehousesResolver } from './warehouses'

import { updateWarehouse } from './update-warehouse'
import { createWarehouse } from './create-warehouse'
import { deleteWarehouse } from './delete-warehouse'

export const Query = {
  ...warehousesResolver,
  ...warehouseResolver
}

export const Mutation = {
  ...updateWarehouse,
  ...createWarehouse,
  ...deleteWarehouse
}
