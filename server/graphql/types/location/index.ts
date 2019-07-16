import { Filter, Pagination, Sorting } from '@things-factory/shell'
import { Location } from './location'
import { LocationList } from './location-list'
import { LocationPatch } from './location-patch'
import { NewLocation } from './new-location'

export const Mutation = `
  createLocation (
    location: NewLocation!
  ): Location

  updateLocation (
    name: String!
    patch: LocationPatch!
  ): Location

  deleteLocation (
    name: String!
  ): Location
`

export const Query = `
  locations(filters: [Filter], pagination: Pagination, sortings: [Sorting]): LocationList
  location(name: String!): Location
`

export const Types = [Filter, Pagination, Sorting, Location, NewLocation, LocationPatch, LocationList]
