import { getRepository } from 'typeorm'
import { PickingBin } from '../../../entities'

export const createPickingBin = {
  async createPickingBin(_: any, { pickingBin}, context: any) {
    return await getRepository(PickingBin).save({
      ...pickingBin,
      domain: context.state.domain,
      creator: context.state.user,
      updater: context.state.user
    })
  }
}

