import { getRepository } from 'typeorm'
import { PalletHistory } from '../../../entities'

export const createPalletHistory = {
  async createPalletHistory(_: any, { palletHistory}, context: any) {
    return await getRepository(PalletHistory).save({
      ...palletHistory,
      domain: context.state.domain,
      creator: context.state.user,
      updater: context.state.user
    })
  }
}

