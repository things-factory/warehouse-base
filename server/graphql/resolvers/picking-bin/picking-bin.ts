import { getRepository } from 'typeorm'
import { PickingBin } from '../../../entities'

export const pickingBinResolver = {
  async pickingBin(_: any, { name }, context: any) {
    const repository = getRepository(PickingBin)

    return await getRepository(PickingBin).findOne({
      where: { domain: context.state.domain, name }, 
      relations: ['domain', 'creator', 'updater']
    })
  }
}

