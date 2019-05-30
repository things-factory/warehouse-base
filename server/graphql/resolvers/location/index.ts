import { locationResolver } from './location'
import { locationsResolver } from './locations'

import { updateLocation } from './update-location'
import { createLocation } from './create-location'
import { deleteLocation } from './delete-location'

export const Query = {
  ...locationsResolver,
  ...locationResolver
}

export const Mutation = {
  ...updateLocation,
  ...createLocation,
  ...deleteLocation
}
