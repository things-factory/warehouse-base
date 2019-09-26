import { getRepository } from 'typeorm'
import { InventoryHistory } from '../../../entities'

export const createInventoryHistory = {
  async createInventoryHistory(_: any, { inventoryHistory }, context: any) {
    return await getRepository(InventoryHistory).save({
      ...inventoryHistory,
      domain: context.state.domain,
      creator: context.state.user,
      updater: context.state.user
    })
  }
}
