import * as Location from './location'
import * as Inventory from './inventory'
import * as Warehouse from './warehouse'
import * as Movement from './movement'

export const queries = [Location.Query, Inventory.Query, Warehouse.Query, Movement.Query]

export const mutations = [Location.Mutation, Inventory.Mutation, Warehouse.Mutation, Movement.Mutation]
