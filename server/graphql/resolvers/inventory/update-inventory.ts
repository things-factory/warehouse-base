import { getRepository } from 'typeorm'
import { Inventory } from '../../../entities'

export const updateInventory = {
  async updateInventory(_, { id, patch }) {
    const repository = getRepository(Inventory)

    const commonCode = await repository.findOne({ id })

    return await repository.save({
      ...commonCode,
      ...patch
    })
  }
}
