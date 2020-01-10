import { getRepository } from 'typeorm'
import { PalletHistory } from '../../../entities'

export const updatePalletHistory = {
  async updatePalletHistory(_: any, { name, patch }, context: any) {
    const repository = getRepository(PalletHistory)
    const palletHistory = await repository.findOne({ 
      where: { domain: context.state.domain, name }
    })

    return await repository.save({
      ...palletHistory,
      ...patch,
      updater: context.state.user
    })
  }
}