import { palletResolver } from './pallet'
import { palletsResolver } from './pallets'

import { updatePallet } from './update-pallet'
import { updateMultiplePallet } from './update-multiple-pallet'
import { createPallet } from './create-pallet'
import { deletePallet } from './delete-pallet'
import { deletePallets } from './delete-pallets'
import { updatePalletSeq } from './update-pallet-seq'

export const Query = {
  ...palletsResolver,
  ...palletResolver
}

export const Mutation = {
  ...updatePallet,
  ...updateMultiplePallet,
  ...createPallet,
  ...deletePallet,
  ...deletePallets,
  ...updatePalletSeq
}
