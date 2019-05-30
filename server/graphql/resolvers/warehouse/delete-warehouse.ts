import { getRepository } from 'typeorm'
import { Warehouse } from '../../../entities'

export const deleteWarehouse = {
  async deleteWarehouse(_, { id }) {
    const repository = getRepository(Warehouse)

    return await repository.delete(id)
  }
}
