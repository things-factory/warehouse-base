import { Filter, ObjectRef, Pagination, Sorting } from '@things-factory/shell'
import * as Container from './container'
import * as Inventory from './inventory'
import * as InventoryHistory from './inventory-history'
import * as Location from './location'
import * as Movement from './movement'
import * as Warehouse from './warehouse'
import * as Dock from './dock'

export const queries = [
  Location.Query,
  Inventory.Query,
  InventoryHistory.Query,
  Warehouse.Query,
  Movement.Query,
  Container.Query,
  Dock.Query
]

export const mutations = [
  Location.Mutation,
  Inventory.Mutation,
  InventoryHistory.Mutation,
  Warehouse.Mutation,
  Movement.Mutation,
  Container.Mutation,
  Dock.Mutation
]

export const types = [
  Pagination,
  Sorting,
  Filter,
  ObjectRef,
  ...Location.Types,
  ...Inventory.Types,
  ...InventoryHistory.Types,
  ...Warehouse.Types,
  ...Movement.Types,
  ...Container.Types,
  ...Dock.Types
]
