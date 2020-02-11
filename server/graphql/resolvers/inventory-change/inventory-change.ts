import { getRepository } from 'typeorm'
import { InventoryChange } from '../../../entities'

export const inventoryChangeResolver = {
  async inventoryChange(_: any, { name }, context: any) {
    const repository = getRepository(InventoryChange)

    return await getRepository(InventoryChange).findOne({
      where: { domain: context.state.domain, name }, 
      relations: ['domain', 'creator', 'updater']
    })
  }
}

