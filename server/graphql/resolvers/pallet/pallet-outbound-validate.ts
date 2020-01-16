import { getRepository } from 'typeorm'
import { Pallet } from '../../../entities'

export const palletOutboundValidateResolver = {
  async palletOutboundValidate(_: any, { name }, context: any) {
    try {
      let item = await getRepository(Pallet).findOne({
        where: { domain: context.state.domain, name },
        relations: ['owner', 'holder', 'domain', 'creator', 'updater']
      })
      if (!item || item?.status != 'ACTIVE') return { error: 'Not found' }
      if (item?.owner?.id != item?.holder?.id) return { error: 'Pallet not in warehouse!' }
      return { item }
    } catch (error) {
      throw error
    }
  }
}
