import { getRepository } from 'typeorm'
import { InventoryChange } from '../../../entities'

export const createInventoryChange = {
  async createInventoryChange(_: any, { inventoryChange}, context: any) {
    return await getRepository(InventoryChange).save({
      ...inventoryChange,
      domain: context.state.domain,
      creator: context.state.user,
      updater: context.state.user
    })
  }
}

