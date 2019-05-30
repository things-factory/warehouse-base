import { movementResolver } from './movement'
import { movementsResolver } from './movements'

import { updateMovement } from './update-movement'
import { createMovement } from './create-movement'
import { deleteMovement } from './delete-movement'

export const Query = {
  ...movementsResolver,
  ...movementResolver
}

export const Mutation = {
  ...updateMovement,
  ...createMovement,
  ...deleteMovement
}
