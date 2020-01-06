import { dockResolver } from './dock'
import { docksResolver } from './docks'

import { updateDock } from './update-dock'
import { updateMultipleDock } from './update-multiple-dock'
import { createDock } from './create-dock'
import { deleteDock } from './delete-dock'
import { deleteDocks } from './delete-docks'

export const Query = {
  ...docksResolver,
  ...dockResolver
}

export const Mutation = {
  ...updateDock,
  ...updateMultipleDock,
  ...createDock,
  ...deleteDock,
  ...deleteDocks
}
