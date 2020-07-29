import { getRepository } from 'typeorm'
import { PickingBin } from '../../../entities'

export const updatePickingBin = {
  async updatePickingBin(_: any, { name, patch }, context: any) {
    const repository = getRepository(PickingBin)
    const pickingBin = await repository.findOne({ 
      where: { domain: context.state.domain, name }
    })

    return await repository.save({
      ...pickingBin,
      ...patch,
      updater: context.state.user
    })
  }
}