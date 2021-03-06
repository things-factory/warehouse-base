import { Location } from './location'
import { LocationList } from './location-list'
import { LocationOccupancy } from './location-occupancy'
import { LocationPatch } from './location-patch'
import { NewLocation } from './new-location'

export const Mutation = /* GraphQL */ `
  createLocation (
    location: NewLocation!
  ): Location @priviledge(category: "warehouse", priviledge: "mutation")

  updateLocation (
    id: String!
    patch: LocationPatch!
  ): Location @priviledge(category: "warehouse", priviledge: "mutation")

  updateMultipleLocation (
    patches: [LocationPatch]!
  ): [Location] @priviledge(category: "warehouse", priviledge: "mutation")

  deleteLocation (
    id: String!
  ): Boolean @priviledge(category: "warehouse", priviledge: "mutation")

  deleteLocations (
    ids: [String]!
  ): Boolean @priviledge(category: "warehouse", priviledge: "mutation")

  deleteAllLocations (
    warehouseId: String!
  ): Boolean @priviledge(category: "warehouse", priviledge: "mutation")
`

export const Query = /* GraphQL */ `
  locations(filters: [Filter], pagination: Pagination, sortings: [Sorting]): LocationList @priviledge(category: "warehouse", priviledge: "query")
  locationOccupancies(warehouse: String): LocationOccupancy @priviledge(category: "warehouse", priviledge: "query")
  location(id: String!): Location @priviledge(category: "warehouse", priviledge: "query")
  locationByName(name: String!): Location @priviledge(category: "warehouse", priviledge: "query")
`

export const Types = [Location, NewLocation, LocationPatch, LocationList, LocationOccupancy]
