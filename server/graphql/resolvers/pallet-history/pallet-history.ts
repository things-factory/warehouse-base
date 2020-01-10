import { getRepository } from 'typeorm'
import { PalletHistory } from '../../../entities'

export const palletHistoryResolver = {
  async palletHistory(_: any, { name }, context: any) {
    const repository = getRepository(PalletHistory)

    return await getRepository(PalletHistory).findOne({
      where: { domain: context.state.domain, name }, 
      relations: ['domain', 'creator', 'updater']
    })
  }
}

