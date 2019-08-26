import { NewWarehouse } from './new-warehouse'
import { Warehouse } from './warehouse'
import { WarehouseList } from './warehouse-list'
import { WarehousePatch } from './warehouse-patch'

export const Mutation = `
  createWarehouse (
    warehouse: NewWarehouse!
  ): Warehouse

  updateWarehouse (
    name: String!
    patch: WarehousePatch!
  ): Warehouse

  updateMultipleWarehouse (
    patches: [WarehousePatch]!
  ): [Warehouse]

  deleteWarehouse (
    name: String!
  ): Boolean

  deleteWarehouses (
    names: [String]!
  ): Boolean
`

export const Query = `
  warehouses(filters: [Filter], pagination: Pagination, sortings: [Sorting]): WarehouseList
  warehouse(id: String!): Warehouse
`

export const Types = [Warehouse, NewWarehouse, WarehousePatch, WarehouseList]
