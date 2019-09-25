import { locationResolver } from './location'
import { locationsResolver } from './locations'

import { updateLocation } from './update-location'
import { updateMultipleLocation } from './update-multiple-location'
import { createLocation } from './create-location'
import { deleteLocation } from './delete-location'
import { deleteLocations } from './delete-locations'
import { deleteAllLocations } from './delete-all-locations'

export const Query = {
  ...locationsResolver,
  ...locationResolver
}

export const Mutation = {
  ...updateLocation,
  ...createLocation,
  ...deleteLocation,
  ...deleteLocations,
  ...deleteAllLocations,
  ...updateMultipleLocation
}
