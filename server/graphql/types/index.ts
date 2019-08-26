import * as Location from './location'
import * as Inventory from './inventory'
import * as Warehouse from './warehouse'
import * as Movement from './movement'
import * as Container from './container'
import { Pagination, Sorting, Filter, ObjectRef } from '@things-factory/shell'

export const queries = [Location.Query, Inventory.Query, Warehouse.Query, Movement.Query, Container.Query]

export const mutations = [
  Location.Mutation,
  Inventory.Mutation,
  Warehouse.Mutation,
  Movement.Mutation,
  Container.Mutation
]

export const types = [
  Pagination,
  Sorting,
  Filter,
  ObjectRef,
  ...Location.Types,
  ...Inventory.Types,
  ...Warehouse.Types,
  ...Movement.Types,
  ...Container.Types
]
