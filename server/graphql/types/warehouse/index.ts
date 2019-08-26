import { Filter, Pagination, Sorting } from '@things-factory/shell'
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
    patch: [WarehousePatch]!
  ): Warehouse

  deleteWarehouse (
    name: String!
  ): Warehouse

  deleteWarehouses (
    names: [String]!
  ): Boolean
`

export const Query = `
  warehouses(filters: [Filter], pagination: Pagination, sortings: [Sorting]): WarehouseList
  warehouse(id: String!): Warehouse
`

export const Types = [Filter, Pagination, Sorting, Warehouse, NewWarehouse, WarehousePatch, WarehouseList]
