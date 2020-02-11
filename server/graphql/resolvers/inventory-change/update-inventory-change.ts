import { getRepository } from 'typeorm'
import { InventoryChange } from '../../../entities'

export const updateInventoryChange = {
  async updateInventoryChange(_: any, { name, patch }, context: any) {
    const repository = getRepository(InventoryChange)
    const inventoryChange = await repository.findOne({ 
      where: { domain: context.state.domain, name }
    })

    return await repository.save({
      ...inventoryChange,
      ...patch,
      updater: context.state.user
    })
  }
}