import { getRepository } from 'typeorm'
import { Pallet } from '../../../entities'

export const updatePallet = {
  async updatePallet(_: any, { name, patch }, context: any) {
    const repository = getRepository(Pallet)
    const pallet = await repository.findOne({ 
      where: { domain: context.state.domain, name }
    })

    return await repository.save({
      ...pallet,
      ...patch,
      updater: context.state.user
    })
  }
}