import { getRepository } from 'typeorm'
import { InventoryHistory } from '../../../entities'

export const updateInventoryHistory = {
  async updateInventoryHistory(_: any, { name, patch }, context: any) {
    const repository = getRepository(InventoryHistory)
    const inventoryHistory = await repository.findOne({
      where: { domain: context.state.domain, name }
    })

    return await repository.save({
      ...inventoryHistory,
      ...patch,
      updater: context.state.user
    })
  }
}
