import { getRepository } from 'typeorm'
import { Pallet } from '../../../entities'

export const palletResolver = {
  async pallet(_: any, { name }, context: any) {
    let records = await getRepository(Pallet).findOne({
      where: { domain: context.state.domain, name },
      relations: ['owner', 'holder', 'domain', 'creator', 'updater']
    })
    return records
  }
}
