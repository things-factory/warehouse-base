import * as Location from './location'
import * as Inventory from './inventory'
import * as Warehouse from './warehouse'
import * as Movement from './movement'
import * as Container from './container'

export const queries = [Location.Query, Inventory.Query, Warehouse.Query, Movement.Query, Container.Query]

export const mutations = [
  Location.Mutation,
  Inventory.Mutation,
  Warehouse.Mutation,
  Movement.Mutation,
  Container.Mutation
]
