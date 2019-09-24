import { Location } from './location'
import { LocationList } from './location-list'
import { LocationPatch } from './location-patch'
import { NewLocation } from './new-location'

export const Mutation = `
  createLocation (
    location: NewLocation!
  ): Location @priviledge(category: "warehouse", priviledge: "mutation")

  updateLocation (
    name: String!
    patch: LocationPatch!
  ): Location @priviledge(category: "warehouse", priviledge: "mutation")

  updateMultipleLocation (
    patches: [LocationPatch]!
  ): [Location] @priviledge(category: "warehouse", priviledge: "mutation")

  deleteLocation (
    name: String!
  ): Boolean @priviledge(category: "warehouse", priviledge: "mutation")

  deleteLocations (
    names: [String]!
  ): Boolean @priviledge(category: "warehouse", priviledge: "mutation")
`

export const Query = `
  locations(filters: [Filter], pagination: Pagination, sortings: [Sorting]): LocationList @priviledge(category: "warehouse", priviledge: "query")
  location(name: String!): Location @priviledge(category: "warehouse", priviledge: "query")
`

export const Types = [Location, NewLocation, LocationPatch, LocationList]
