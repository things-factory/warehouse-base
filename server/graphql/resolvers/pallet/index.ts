import { palletResolver } from './pallet'
import { palletsResolver } from './pallets'
import { palletReturnValidateResolver } from './pallet-return-validate'

import { updatePallet } from './update-pallet'
import { updateMultiplePallet } from './update-multiple-pallet'
import { createPallet } from './create-pallet'
import { deletePallet } from './delete-pallet'
import { deletePallets } from './delete-pallets'
import { palletReturn } from './pallet-return'

export const Query = {
  ...palletsResolver,
  ...palletResolver,
  ...palletReturnValidateResolver
}

export const Mutation = {
  ...updatePallet,
  ...updateMultiplePallet,
  ...createPallet,
  ...deletePallet,
  ...deletePallets,
  ...palletReturn
}
