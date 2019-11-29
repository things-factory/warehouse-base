import { getRepository } from 'typeorm'
import { Pallet } from '../../../entities'

export const createPallet = {
  async createPallet(_: any, { pallet}, context: any) {
    return await getRepository(Pallet).save({
      ...pallet,
      domain: context.state.domain,
      creator: context.state.user,
      updater: context.state.user
    })
  }
}

