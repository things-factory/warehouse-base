import { movementResolver } from './movement'
import { movementsResolver } from './movements'
import { inboundMovementsCounterResolver } from './inbound-movements-counter'
import { outboundMovementsCounterResolver } from './outbound-movements-counter'
import { weeklyMovementsCounterResolver } from './weekly-movements-counter'

import { updateMovement } from './update-movement'
import { createMovement } from './create-movement'
import { deleteMovement } from './delete-movement'

export const Query = {
  ...movementsResolver,
  ...movementResolver,
  ...inboundMovementsCounterResolver,
  ...outboundMovementsCounterResolver,
  ...weeklyMovementsCounterResolver
}

export const Mutation = {
  ...updateMovement,
  ...createMovement,
  ...deleteMovement
}
