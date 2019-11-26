import * as Container from './container'
import * as Inventory from './inventory'
import * as InventoryHistory from './inventory-history'
import * as Location from './location'
import * as Movement from './movement'
import * as Warehouse from './warehouse'
import * as Pallet from './pallet'

export const queries = [
  Location.Query,
  Inventory.Query,
  InventoryHistory.Query,
  Warehouse.Query,
  Movement.Query,
  Container.Query,
  Pallet.Query
]

export const mutations = [
  Location.Mutation,
  Inventory.Mutation,
  InventoryHistory.Mutation,
  Warehouse.Mutation,
  Movement.Mutation,
  Container.Mutation,
  Pallet.Mutation
]
