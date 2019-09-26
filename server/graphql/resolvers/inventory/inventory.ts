import { getRepository } from 'typeorm'
import { Inventory } from '../../../entities'

export const inventoryResolver = {
  async inventory(_: any, { name }, context: any) {
    return await getRepository(Inventory).findOne({
      where: { domain: context.state.domain, name },
      relations: ['domain', 'bizplace', 'product', 'location', 'warehouse', 'creator', 'updater']
    })
  }
}
