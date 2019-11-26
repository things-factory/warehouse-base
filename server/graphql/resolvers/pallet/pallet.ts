import { getRepository } from 'typeorm'
import { Pallet } from '../../../entities'

export const palletResolver = {
  async pallet(_: any, { name }, context: any) {
    const repository = getRepository(Pallet)

    return await getRepository(Pallet).findOne({
      where: { domain: context.state.domain, name, relations: ['domain', 'creator', 'updater']}
    })
  }
}

