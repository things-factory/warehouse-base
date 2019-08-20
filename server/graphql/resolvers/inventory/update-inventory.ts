import { getRepository } from 'typeorm'
import { Inventory } from '../../../entities'

export const updateInventory = {
  async updateInventory(_: any, { name, patch }, context: any) {
    const repository = getRepository(Inventory)
    const inventory = await repository.findOne({ where: { domain: context.domain, name } })

    return await repository.save({
      ...inventory,
      ...patch,
      updater: context.state.user
    })
  }
}
