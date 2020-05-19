import { createLocation, createLocationResolver } from './create-location'
import { deleteAllLocations } from './delete-all-locations'
import { deleteLocation, deleteLocationResolver } from './delete-location'
import { deleteLocations, deleteLocationsResolver } from './delete-locations'
import { locationResolver } from './location'
import { locationByNameResolver } from './location-by-name'
import { locationOccupanciesResolver } from './location-occupancies'
import { locationsResolver } from './locations'
import { updateLocation, updateLocationResolver } from './update-location'
import { updateMultipleLocation } from './update-multiple-location'

export const Query = {
  ...locationsResolver,
  ...locationResolver,
  ...locationByNameResolver,
  ...locationOccupanciesResolver
}

export const Mutation = {
  ...updateLocationResolver,
  ...createLocationResolver,
  ...deleteLocationResolver,
  ...deleteLocationsResolver,
  ...deleteAllLocations,
  ...updateMultipleLocation
}

export { updateLocation, createLocation, deleteLocation, deleteLocations }
