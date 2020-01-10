import { getRepository } from 'typeorm'
import { PalletHistory } from '../../../entities'

export const deletePalletHistory = {
  async deletePalletHistory(_: any, { name }, context: any) {
    await getRepository(PalletHistory).delete({ domain: context.state.domain, name })
    return true
  }
}

