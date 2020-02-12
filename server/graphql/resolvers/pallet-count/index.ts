import { palletCountResolver } from './pallet-count'
import { palletCountsResolver } from './pallet-counts'

import { updatePalletCount } from './update-pallet-count'
import { updateMultiplePalletCount } from './update-multiple-pallet-count'
import { createPalletCount } from './create-pallet-count'
import { deletePalletCount } from './delete-pallet-count'
import { deletePalletCounts } from './delete-pallet-counts'
import { updatePalletCountSeq } from './update-pallet-count-seq'
import { generatePalletIdResolver } from './generate-pallet-id'

export const Query = {
  ...palletCountsResolver,
  ...palletCountResolver,
  ...generatePalletIdResolver
}

export const Mutation = {
  ...updatePalletCount,
  ...updateMultiplePalletCount,
  ...createPalletCount,
  ...deletePalletCount,
  ...deletePalletCounts,
  ...updatePalletCountSeq
}
