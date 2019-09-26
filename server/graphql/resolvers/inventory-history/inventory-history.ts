import { getRepository } from 'typeorm'
import { InventoryHistory } from '../../../entities'

export const inventoryHistoryResolver = {
  async inventoryHistory(_: any, { name }, context: any) {
    return await getRepository(InventoryHistory).findOne({
      where: { domain: context.state.domain, name, relations: ['domain', 'creator', 'updater'] }
    })
  }
}
