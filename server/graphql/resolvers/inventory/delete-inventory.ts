import { getRepository } from 'typeorm'
import { Inventory } from '../../../entities'

export const deleteInventory = {
  async deleteInventory(_, { id }) {
    const repository = getRepository(Inventory)

    return await repository.delete(id)
  }
}
