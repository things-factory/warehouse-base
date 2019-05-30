import { Location } from './location'
import { NewLocation } from './new-location'
import { LocationPatch } from './location-patch'

export const Mutation = `
  createLocation (
    location: NewLocation!
  ): Location

  updateLocation (
    id: String!
    patch: LocationPatch!
  ): Location

  deleteLocation (
    id: String!
  ): Location

  publishLocation (
    id: String!
  ): Location
`

export const Query = `
  locations: [Location]
  location(id: String!): Location
`

export const Types = [Location, NewLocation, LocationPatch]
