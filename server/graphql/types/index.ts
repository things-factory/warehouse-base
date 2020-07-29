import { Filter, ObjectRef, Pagination, Sorting } from '@things-factory/shell'
import * as Inventory from './inventory'
import * as InventoryChange from './inventory-change'
import * as InventoryHistory from './inventory-history'
import * as Location from './location'
import * as Movement from './movement'
import * as Warehouse from './warehouse'
import * as Pallet from './pallet'
import * as PalletHistory from './pallet-history'
import * as PalletCount from './pallet-count'
import * as PickingBin from './picking-bin'

export const queries = [
  Location.Query,
  Inventory.Query,
  InventoryChange.Query,
  InventoryHistory.Query,
  Warehouse.Query,
  Movement.Query,
  Pallet.Query,
  PalletHistory.Query,
  PalletCount.Query,
  PickingBin.Query
]

export const mutations = [
  Location.Mutation,
  Inventory.Mutation,
  InventoryChange.Mutation,
  InventoryHistory.Mutation,
  Warehouse.Mutation,
  Movement.Mutation,
  Pallet.Mutation,
  PalletHistory.Mutation,
  PalletCount.Mutation,
  PickingBin.Mutation
]

export const types = [
  Pagination,
  Sorting,
  Filter,
  ObjectRef,
  ...Location.Types,
  ...Inventory.Types,
  ...InventoryChange.Types,
  ...InventoryHistory.Types,
  ...Warehouse.Types,
  ...Movement.Types,
  ...Pallet.Types,
  ...PalletHistory.Types,
  ...PalletCount.Types,
  ...PickingBin.Types
]
