import { getRepository, In } from 'typeorm'
import { PalletCount } from '../../../entities'

export const deletePalletCounts = {
  async deletePalletCounts(_: any, { names }, context: any) {
    await getRepository(PalletCount).delete({ 
        domain: context.state.domain,
        name: In(names)
    })
    return true
  }
}

