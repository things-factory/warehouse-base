import { getRepository, In } from 'typeorm'
import { PalletHistory } from '../../../entities'

export const deletePalletHistories = {
  async deletePalletHistories(_: any, { names }, context: any) {
    await getRepository(PalletHistory).delete({ 
        domain: context.state.domain,
        name: In(names)
    })
    return true
  }
}

