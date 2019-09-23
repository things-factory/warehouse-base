import { getRepository } from 'typeorm'
import { Inventory } from '../../../entities'

export const inventoryResolver = {
  async inventory(_: any, { name }, context: any) {
    return await getRepository(Inventory).findOne({
      where: { domain: context.state.domain, name },
      relations: ['domain', 'product', 'location', 'movements', 'creator', 'updater']
    })
  }
}
