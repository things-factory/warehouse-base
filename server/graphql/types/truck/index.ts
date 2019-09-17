import { Truck } from './truck'
import { NewTruck } from './new-truck'
import { TruckPatch } from './truck-patch'
import { TruckList } from './truck-list'

export const Mutation = `
  createTruck (
    truck: NewTruck!
  ): Truck

  updateTruck (
    name: String!
    patch: TruckPatch!
  ): Truck

  updateMultipleTruck (
    patches: [TruckPatch]!
  ): [Truck]

  deleteTruck (
    name: String!
  ): Boolean

  deleteTrucks (
    names: [String]!
  ): Boolean
`

export const Query = `
  trucks(filters: [Filter], pagination: Pagination, sortings: [Sorting]): TruckList
  truck(name: String!): Truck
`

export const Types = [Truck, NewTruck, TruckPatch, TruckList]
