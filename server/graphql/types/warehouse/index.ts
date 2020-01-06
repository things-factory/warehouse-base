import { NewWarehouse } from './new-warehouse'
import { Warehouse } from './warehouse'
import { WarehouseList } from './warehouse-list'
import { WarehousePatch } from './warehouse-patch'
import { directivePriviledge } from '@things-factory/auth-base'

export const Mutation = `
  createWarehouse (
    warehouse: NewWarehouse!
  ): Warehouse @priviledge(category: "warehouse", priviledge: "mutation")

  updateWarehouse (
    id: String!
    patch: WarehousePatch!
  ): Warehouse @priviledge(category: "warehouse", priviledge: "mutation")

  updateMultipleWarehouse (
    patches: [WarehousePatch]!
  ): [Warehouse] @priviledge(category: "warehouse", priviledge: "mutation")

  deleteWarehouse (
    id: String!
  ): Boolean @priviledge(category: "warehouse", priviledge: "mutation")

  deleteWarehouses (
    ids: [String]!
  ): Boolean @priviledge(category: "warehouse", priviledge: "mutation")
`

export const Query = `
  warehouses(filters: [Filter], pagination: Pagination, sortings: [Sorting]): WarehouseList @priviledge(category: "warehouse", priviledge: "query")
  warehouse(id: String!): Warehouse @priviledge(category: "warehouse", priviledge: "query")
`

export const Types = [Warehouse, NewWarehouse, WarehousePatch, WarehouseList]
