import uuid from 'uuid/v4'

import { getRepository } from 'typeorm'
import { Inventory } from '../../../entities'

export const createInventory = {
  async createInventory(_, { inventory: attrs }) {
    const repository = getRepository(Inventory)
    const newInventory = {
      id: uuid(),
      ...attrs
    }

    return await repository.save(newInventory)
  }
}
