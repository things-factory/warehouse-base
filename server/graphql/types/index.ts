import * as Location from './location'
import * as Warehouse from './warehouse'

export const queries = [Location.Query, Warehouse.Query]

export const mutations = [Location.Mutation, Warehouse.Mutation]

export const types = [...Location.Types, ...Warehouse.Types]
