import { palletHistoryResolver } from './pallet-history'
import { palletHistoriesResolver } from './pallet-histories'

import { updatePalletHistory } from './update-pallet-history'
import { updateMultiplePalletHistory } from './update-multiple-pallet-history'
import { createPalletHistory } from './create-pallet-history'
import { deletePalletHistory } from './delete-pallet-history'
import { deletePalletHistories } from './delete-pallet-histories'

export const Query = {
  ...palletHistoriesResolver,
  ...palletHistoryResolver
}

export const Mutation = {
  ...updatePalletHistory,
  ...updateMultiplePalletHistory,
  ...createPalletHistory,
  ...deletePalletHistory,
  ...deletePalletHistories
}
