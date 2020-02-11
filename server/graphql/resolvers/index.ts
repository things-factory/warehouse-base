import * as Container from './container'
import * as Dock from './dock'
import * as Inventory from './inventory'
import * as InventoryChange from './inventory-change'
import * as InventoryHistory from './inventory-history'
import * as Location from './location'
import * as Movement from './movement'
import * as Warehouse from './warehouse'
import * as Pallet from './pallet'
import * as PalletHistory from './pallet-history'
import * as PalletCount from './pallet-count'

export const queries = [
  Location.Query,
  Inventory.Query,
  InventoryChange.Query,
  InventoryHistory.Query,
  Warehouse.Query,
  Movement.Query,
  Container.Query,
  Dock.Query,
  Pallet.Query,
  PalletHistory.Query,
  PalletCount.Query
]

export const mutations = [
  Location.Mutation,
  Inventory.Mutation,
  InventoryChange.Mutation,
  InventoryHistory.Mutation,
  Warehouse.Mutation,
  Movement.Mutation,
  Container.Mutation,
  Dock.Mutation,
  Pallet.Mutation,
  PalletHistory.Mutation,
  PalletCount.Mutation
]
