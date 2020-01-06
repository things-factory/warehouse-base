import { getRepository } from 'typeorm'
import { PalletCount } from '../../../entities'

export const palletCountResolver = {
  async palletCount(_: any, { name }, context: any) {
    const repository = getRepository(PalletCount)

    return await getRepository(PalletCount).findOne({
      where: { domain: context.state.domain, name }, 
      relations: ['domain', 'creator', 'updater']
    })
  }
}

