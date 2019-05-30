import uuid from 'uuid/v4'

import { getRepository } from 'typeorm'
import { Warehouse } from '../../../entities'

export const createWarehouse = {
  async createWarehouse(_, { warehouse: attrs }) {
    const repository = getRepository(Warehouse)
    const newWarehouse = {
      id: uuid(),
      ...attrs
    }

    return await repository.save(newWarehouse)
  }
}
