import { getRepository } from 'typeorm'
import { PalletCount } from '../../../entities'

export const updatePalletCount = {
  async updatePalletCount(_: any, { name, patch }, context: any) {
    const repository = getRepository(PalletCount)
    const palletCount = await repository.findOne({ 
      where: { domain: context.state.domain, name }
    })

    return await repository.save({
      ...palletCount,
      ...patch,
      updater: context.state.user
    })
  }
}