import { pickingBinResolver } from './picking-bin'
import { pickingBinsResolver } from './picking-bins'

import { updatePickingBin } from './update-picking-bin'
import { updateMultiplePickingBin } from './update-multiple-picking-bin'
import { createPickingBin } from './create-picking-bin'
import { deletePickingBin } from './delete-picking-bin'
import { deletePickingBins } from './delete-picking-bins'

export const Query = {
  ...pickingBinsResolver,
  ...pickingBinResolver
}

export const Mutation = {
  ...updatePickingBin,
  ...updateMultiplePickingBin,
  ...createPickingBin,
  ...deletePickingBin,
  ...deletePickingBins
}
