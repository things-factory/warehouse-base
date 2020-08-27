import { getRepository } from 'typeorm'
import { Pallet } from '../../../entities'

export const palletByStatusResolver = {
  async palletByStatus(_: any, { name, status }, context: any) {
    let records = await getRepository(Pallet).findOne({
      where: { domain: context.state.domain, name, status },
      relations: ['owner', 'holder', 'domain', 'creator', 'updater']
    })

    return records
  }
}
