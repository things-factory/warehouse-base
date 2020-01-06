import { createLocation, createLocationResolver } from './create-location'
import { deleteAllLocations } from './delete-all-locations'
import { deleteLocation, deleteLocationResolver } from './delete-location'
import { deleteLocations, deleteLocationsResolver } from './delete-locations'
import { locationResolver } from './location'
import { locationsResolver } from './locations'
import { updateLocation, updateLocationResolver } from './update-location'
import { updateMultipleLocation } from './update-multiple-location'

export const Query = {
  ...locationsResolver,
  ...locationResolver
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
