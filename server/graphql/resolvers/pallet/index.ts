import { palletResolver } from './pallet'
import { palletsResolver } from './pallets'
import { palletInboundValidateResolver } from './pallet-inbound-validate'
import { palletOutboundValidateResolver } from './pallet-outbound-validate'

import { updatePallet } from './update-pallet'
import { updateMultiplePallet } from './update-multiple-pallet'
import { createPallet } from './create-pallet'
import { deletePallet } from './delete-pallet'
import { deletePallets } from './delete-pallets'
import { palletReturn } from './pallet-return'

export const Query = {
  ...palletsResolver,
  ...palletResolver,
  ...palletInboundValidateResolver,
  ...palletOutboundValidateResolver
}

export const Mutation = {
  ...updatePallet,
  ...updateMultiplePallet,
  ...createPallet,
  ...deletePallet,
  ...deletePallets,
  ...palletReturn
}
