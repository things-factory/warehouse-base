import { getRepository } from 'typeorm'
import { PalletCount } from '../../../entities'

export const createPalletCount = {
  async createPalletCount(_: any, { palletCount}, context: any) {
    return await getRepository(PalletCount).save({
      ...palletCount,
      domain: context.state.domain,
      creator: context.state.user,
      updater: context.state.user
    })
  }
}

