import { Warehouse } from './warehouse'
import { NewWarehouse } from './new-warehouse'
import { WarehousePatch } from './warehouse-patch'

export const Mutation = `
  createWarehouse (
    warehouse: NewWarehouse!
  ): Warehouse

  updateWarehouse (
    id: String!
    patch: WarehousePatch!
  ): Warehouse

  deleteWarehouse (
    id: String!
  ): Warehouse

  publishWarehouse (
    id: String!
  ): Warehouse
`

export const Query = `
  warehouses: [Warehouse]
  warehouse(id: String!): Warehouse
`

export const Types = [Warehouse, NewWarehouse, WarehousePatch]
