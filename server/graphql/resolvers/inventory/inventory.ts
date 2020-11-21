import { getRepository } from 'typeorm'
import { Inventory } from '../../../entities'

export const inventoryResolver = {
  async inventory(_: any, { palletId }, context: any) {
    return await getRepository(Inventory).findOne({
      where: { domain: context.state.domain, palletId },
      relations: ['domain', 'bizplace', 'product', 'location', 'warehouse', 'creator', 'updater']
    })
  }
}
