import { getRepository } from 'typeorm'
import { Inventory } from '../../../entities'

export const inventoriesResolver = {
  async inventories() {
    const repository = getRepository(Inventory)

    return await repository.find()
  }
}
